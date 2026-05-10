package main

import (
	"log"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/khamushu/todo-backend/internal/db"
	"github.com/khamushu/todo-backend/internal/handlers"
	"github.com/khamushu/todo-backend/internal/middleware"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Connect to Supabase PostgreSQL
	db.Connect()

	r := gin.Default()

	// Allow requests from the Next.js frontend
	// FRONTEND_URL supports comma-separated origins e.g. "https://app.vercel.app,http://localhost:3000"
	rawOrigins := os.Getenv("FRONTEND_URL")
	allowedOrigins := strings.Split(rawOrigins, ",")
	for i, o := range allowedOrigins {
		allowedOrigins[i] = strings.TrimSpace(o)
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins: allowedOrigins,
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Authorization", "Content-Type"},
	}))

	// Health check (no auth required)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// All /api routes require a valid Supabase JWT
	api := r.Group("/api")
	api.Use(middleware.AuthRequired())
	{
		api.GET("/todos", handlers.GetTodos)
		api.POST("/todos", handlers.CreateTodo)
		api.PUT("/todos/:id", handlers.UpdateTodo)
		api.DELETE("/todos/:id", handlers.DeleteTodo)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on port %s", port)
	r.Run(":" + port)
}
