import React from 'react'
import { usePantry, SavedRecipe } from '../lib/usePantry'
import { Button, Card, List, message, Image } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

export function SavedRecipes() {
  const { savedRecipes, loading, error, removeSavedRecipe } = usePantry()

  const handleRemoveRecipe = async (recipeId: string) => {
    try {
      await removeSavedRecipe(recipeId)
      message.success('Recipe removed from saved recipes')
    } catch (err) {
      message.error('Failed to remove recipe')
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Saved Recipes</h2>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        loading={loading}
        dataSource={savedRecipes}
        renderItem={(recipe: SavedRecipe) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <Image
                  alt={recipe.recipe_name}
                  src={recipe.recipe_image}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
              actions={[
                <Button
                  key="remove"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveRecipe(recipe.recipe_id)}
                >
                  Remove
                </Button>,
              ]}
            >
              <Card.Meta
                title={recipe.recipe_name}
                description={`Saved on ${new Date(recipe.created_at).toLocaleDateString()}`}
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
} 