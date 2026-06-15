import { useState } from 'react';
import GateEntryForm from '../../../../pages/GateEntry/GateEntryForm';
import GateEntryList from '../../../../pages/GateEntry/GateEntryList';

export default function GateEntryPage() {
  const [isAdding, setIsAdding] = useState(false);

  if (isAdding) {
    return (
      <GateEntryForm 
        onCancel={() => setIsAdding(false)} 
        onSuccess={() => setIsAdding(false)} 
      />
    );
  }

  return (
    <GateEntryList 
      onAddClick={() => setIsAdding(true)} 
    />
  );
}
