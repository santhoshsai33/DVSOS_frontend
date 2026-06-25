import { useState } from 'react';
import GateEntryForm from './GateEntryForm';
import GateEntryList from './GateEntryList';
import GateEntryDetails from './GateEntryDetails';
import GateEntryUpdate from './GateEntryUpdate';

export default function GateEntryPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [updatingVehicle, setUpdatingVehicle] = useState(null);

  if (isAdding) {
    return (
      <GateEntryForm 
        onCancel={() => setIsAdding(false)} 
        onSuccess={() => setIsAdding(false)} 
      />
    );
  }

  if (updatingVehicle) {
    return (
      <GateEntryUpdate 
        vehicle={updatingVehicle} 
        onBack={() => setUpdatingVehicle(null)} 
      />
    );
  }

  return (
    <GateEntryList 
      onAddClick={() => setIsAdding(true)} 
      onEntryClick={(vehicle) => setUpdatingVehicle(vehicle)}
    />
  );
}
