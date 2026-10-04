import { useState } from 'react';
import { ORDER_STATUSES, type OrderStatus } from '@/types';
import { Button, Select } from '../ui';

type OrderStatusSelectorProps = {
  currentStatus: OrderStatus;
  isSaving: boolean;
  onSave: (status: OrderStatus) => void;
};

export function OrderStatusSelector({ currentStatus, isSaving, onSave }: OrderStatusSelectorProps) {
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);
  const [lastStatus, setLastStatus] = useState(currentStatus);

  // Si el estado cambia desde afuera (ej. luego de guardar), se sincroniza la selección.
  if (lastStatus !== currentStatus) {
    setLastStatus(currentStatus);
    setSelected(currentStatus);
  }

  const isDirty = selected !== currentStatus;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (isDirty) onSave(selected);
      }}
    >
      <Select
        label="Cambiar estado"
        value={selected}
        onChange={(event) => setSelected(event.target.value as OrderStatus)}
        disabled={isSaving}
      >
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Select>
      <Button type="submit" disabled={!isDirty} isLoading={isSaving} loadingText="Actualizando pedido..." fullWidth>
        Guardar estado
      </Button>
    </form>
  );
}
