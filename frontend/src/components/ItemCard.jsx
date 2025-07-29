import React from 'react';

function ItemCard({ item }) {
    return (
        <div className="border rounded-lg p-2 text-center shadow-sm">
            <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-md mb-2" />
            <p className="text-sm font-medium text-gray-700">{item.name}</p>
        </div>
    );
}

export default ItemCard;
