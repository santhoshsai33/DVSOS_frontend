import { useState } from 'react';
import GateEntryForm from '../../../../pages/GateEntry/GateEntryForm';
import GateEntryList from '../../../../pages/GateEntry/GateEntryList';
import GateEntryDetails from './GateEntryDetails';
import GateEntryUpdate from './GateEntryUpdate';

export default function GateEntryPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [updatingVehicle, setUpdatingVehicle] = useState(null);

  if (isAdding) {
    return (
      <GateEntryForm 
        onCancel={() => setIsAdding(false)} 
        onSuccess={() => setIsAdding(false)} 
      />
    );
  }

  if (viewingVehicle) {
    return (
      <GateEntryDetails 
        vehicle={viewingVehicle} 
        onBack={() => setViewingVehicle(null)} 
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
      onViewClick={(vehicle) => setViewingVehicle(vehicle)}
      onEntryClick={(vehicle) => setUpdatingVehicle(vehicle)}
    />
  );
}
