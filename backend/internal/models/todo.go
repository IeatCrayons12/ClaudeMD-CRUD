package models

import "time"

// Todo represents a single todo item owned by a user
type Todo struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    string    `json:"user_id" gorm:"not null"`
	Title     string    `json:"title" gorm:"not null"`
	Done      bool      `json:"done" gorm:"default:false"`
	CreatedAt time.Time `json:"created_at"`
}
