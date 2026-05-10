package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/khamushu/todo-backend/internal/db"
	"github.com/khamushu/todo-backend/internal/models"
)

// GetTodos returns all todos belonging to the logged-in user
func GetTodos(c *gin.Context) {
	userID := c.GetString("user_id")

	var todos []models.Todo
	if err := db.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&todos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch todos"})
		return
	}

	c.JSON(http.StatusOK, todos)
}

// CreateTodo creates a new todo for the logged-in user
func CreateTodo(c *gin.Context) {
	userID := c.GetString("user_id")

	var body struct {
		Title string `json:"title" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}

	todo := models.Todo{
		UserID: userID,
		Title:  body.Title,
		Done:   false,
	}

	if err := db.DB.Create(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create todo"})
		return
	}

	c.JSON(http.StatusCreated, todo)
}

// UpdateTodo toggles the done status of a todo (must belong to the logged-in user)
func UpdateTodo(c *gin.Context) {
	userID := c.GetString("user_id")
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
		return
	}

	var todo models.Todo
	if err := db.DB.Where("id = ? AND user_id = ?", id, userID).First(&todo).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}

	todo.Done = !todo.Done
	if err := db.DB.Save(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update todo"})
		return
	}

	c.JSON(http.StatusOK, todo)
}

// DeleteTodo deletes a todo (must belong to the logged-in user)
func DeleteTodo(c *gin.Context) {
	userID := c.GetString("user_id")
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
		return
	}

	result := db.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Todo{})
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted"})
}
