package middleware

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type ecJWK struct {
	Kty string `json:"kty"`
	Crv string `json:"crv"`
	X   string `json:"x"`
	Y   string `json:"y"`
	Kid string `json:"kid"`
}

type jwksPayload struct {
	Keys []ecJWK `json:"keys"`
}

// keyCache maps kid → parsed EC public key, fetched once from the JWKS URL
var (
	keyCache = map[string]*ecdsa.PublicKey{}
	fetchOnce sync.Once
	fetchErr  error
)

// fetchJWKS fetches the JWKS from Supabase and caches all EC keys by kid.
// Only runs once at first request.
func fetchJWKS() error {
	supabaseURL := os.Getenv("SUPABASE_URL")
	if supabaseURL == "" {
		return fmt.Errorf("SUPABASE_URL env var is not set")
	}

	jwksURL := strings.TrimRight(supabaseURL, "/") + "/auth/v1/.well-known/jwks.json"
	resp, err := http.Get(jwksURL)
	if err != nil {
		return fmt.Errorf("failed to fetch JWKS: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read JWKS response: %w", err)
	}

	var ks jwksPayload
	if err := json.Unmarshal(body, &ks); err != nil || len(ks.Keys) == 0 {
		return fmt.Errorf("invalid JWKS response from %s", jwksURL)
	}

	for _, k := range ks.Keys {
		xBytes, err := base64.RawURLEncoding.DecodeString(k.X)
		if err != nil {
			continue
		}
		yBytes, err := base64.RawURLEncoding.DecodeString(k.Y)
		if err != nil {
			continue
		}
		keyCache[k.Kid] = &ecdsa.PublicKey{
			Curve: elliptic.P256(),
			X:     new(big.Int).SetBytes(xBytes),
			Y:     new(big.Int).SetBytes(yBytes),
		}
	}

	if len(keyCache) == 0 {
		return fmt.Errorf("no valid EC keys found in JWKS")
	}
	return nil
}

// getKey returns the EC public key matching the token's kid header.
func getKey(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodECDSA); !ok {
		return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
	}

	fetchOnce.Do(func() {
		fetchErr = fetchJWKS()
	})
	if fetchErr != nil {
		return nil, fetchErr
	}

	kid, _ := token.Header["kid"].(string)

	// Match by kid if present, otherwise fall back to first key
	if kid != "" {
		if key, ok := keyCache[kid]; ok {
			return key, nil
		}
		return nil, fmt.Errorf("no key found for kid: %s", kid)
	}
	for _, key := range keyCache {
		return key, nil
	}
	return nil, fmt.Errorf("no keys in cache")
}

// AuthRequired validates the Supabase JWT (ES256) using the JWKS discovery URL.
// Injects user_id into the Gin context for handlers.
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization header"})
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenStr, getKey)
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		userID, ok := claims["sub"].(string)
		if !ok || userID == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing user ID in token"})
			return
		}

		c.Set("user_id", userID)
		c.Next()
	}
}
