import React, { useMemo } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';

const InventoryGrid: React.FC<{ inventory: Inventory; side: 'left' | 'right' }> = ({ inventory, side }) => {
  const weight = useMemo(
    () =>
      inventory.maxWeight !== undefined
        ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000
        : 0,
    [inventory.maxWeight, inventory.items]
  );

  const isBusy = useAppSelector((state) => state.inventory.isBusy);
  const isPlayerInventory = inventory.type === 'player';

  // For player inventories, separate hotbar and main inventory.
  const hotbarItems = isPlayerInventory ? inventory.items.slice(0, 5) : [];
  let mainInventoryItems = isPlayerInventory ? inventory.items.slice(5) : inventory.items;

  return (
    <div className={`inventory-grid-wrapper ${side}-inventory`} style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div className="inventory-grid-header-wrapper">
          {isPlayerInventory ? (
            <div className="inventory-grid-title">
              <h1>Inventory</h1>
              <p>{inventory.label}</p>
            </div>
          ) : (
            <div className="inventory-grid-title">
              <h1>{inventory.type.charAt(0).toUpperCase() + inventory.type.slice(1)}</h1>
              <p>{inventory.label}</p>
            </div>
          )}
          {inventory.maxWeight && (
            <p>
              {weight / 1000}/{inventory.maxWeight / 1000}kg
            </p>
          )}
        </div>
        <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
      </div>

      {/* Hotbar Section - Only for player inventories */}
      {isPlayerInventory && <div className="section-label">Hotbar</div>}
      {isPlayerInventory && (
        <div className="hotbar-section">
          <div className="hotbar-slots">
            {hotbarItems.map((item) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Inventory */}
      {/* Main Inventory */}
{isPlayerInventory && <div className="section-label">Pockets</div>}
<div className="inventory-grid-container">
  {mainInventoryItems.map((item, index) => (
    <React.Fragment key={`${inventory.type}-${inventory.id}-${item.slot}`}>
      {/* Secret Pocket Label for the Last Inventory Slot */}
      {index === mainInventoryItems.length - 1 && isPlayerInventory && (
        <div className="secret-pocket-label">Secret Pocket</div>
      )}
      <InventorySlot
        item={item}
        inventoryType={inventory.type}
        inventoryGroups={inventory.groups}
        inventoryId={inventory.id}
        style={
          isPlayerInventory && index === mainInventoryItems.length - 1
            ?  { gridRowStart: 'span 1', gridColumnStart: '1' }
            : {}
        }
        className={index === mainInventoryItems.length - 1 ? 'last-inventory-slot' : ''}
      />
    </React.Fragment>
  ))}
</div>

    </div>
  );
};


export default InventoryGrid;
