import React, { useState, ChangeEvent } from 'react'
import { usePantry, PantryItem } from '../lib/usePantry'
import { Button, Input, Select, Table, message } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

const { Option } = Select

type NewItem = {
  ingredient_name: string
  quantity: number
  unit: string
}

export function PantryList() {
  const { pantryItems, loading, error, addPantryItem, removePantryItem } = usePantry()
  const [newItem, setNewItem] = useState<NewItem>({
    ingredient_name: '',
    quantity: 1,
    unit: 'g',
  })
  const [isAdding, setIsAdding] = useState(false)

  const handleAddItem = async () => {
    if (!newItem.ingredient_name.trim()) {
      message.error('Please enter an ingredient name')
      return
    }

    setIsAdding(true)
    try {
      await addPantryItem(newItem)
      setNewItem({
        ingredient_name: '',
        quantity: 1,
        unit: 'g',
      })
      message.success('Item added to pantry')
    } catch (err) {
      message.error('Failed to add item')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      await removePantryItem(id)
      message.success('Item removed from pantry')
    } catch (err) {
      message.error('Failed to remove item')
    }
  }

  const columns = [
    {
      title: 'Ingredient',
      dataIndex: 'ingredient_name',
      key: 'ingredient_name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: PantryItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id)}
        />
      ),
    },
  ]

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Ingredient name"
          value={newItem.ingredient_name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            setNewItem({ ...newItem, ingredient_name: e.target.value })}
          style={{ width: 200 }}
        />
        <Input
          type="number"
          min={0}
          value={newItem.quantity}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          style={{ width: 100 }}
        />
        <Select
          value={newItem.unit}
          onChange={(value: string) => setNewItem({ ...newItem, unit: value })}
          style={{ width: 100 }}
        >
          <Option value="g">g</Option>
          <Option value="kg">kg</Option>
          <Option value="ml">ml</Option>
          <Option value="l">l</Option>
          <Option value="tsp">tsp</Option>
          <Option value="tbsp">tbsp</Option>
          <Option value="cup">cup</Option>
          <Option value="piece">piece</Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddItem}
          loading={isAdding}
        >
          Add
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={pantryItems}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  )
} 