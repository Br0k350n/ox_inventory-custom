import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory; side: 'left' | 'right' }> = ({ inventory, side }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);
  const isPlayerInventory = inventory.type === 'player';

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  // Only separate hotbar items if it's a player inventory
  const hotbarItems = isPlayerInventory ? inventory.items.slice(0, 5) : [];
  const mainInventoryItems = isPlayerInventory ? inventory.items.slice(5) : inventory.items;

  return (
    <>
      <div className={`inventory-grid-wrapper ${side}-inventory`} style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div className="inventory-grid-header-wrapper">
            <div className="inventory-grid-title">
              <h1>Inventory</h1>
              <p>{inventory.label}</p>
            </div>
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
        {isPlayerInventory && <div className="section-label">Pockets</div>}

        <div className="inventory-grid-container" ref={containerRef}>
          <>
            {mainInventoryItems.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
