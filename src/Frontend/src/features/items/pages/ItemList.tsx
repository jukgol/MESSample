import { useItems } from './useItems';
import ItemHeader from './ItemHeader';
import ItemTable from './ItemTable';

const ItemList = () => {
  const { items, loading, error, fetchItems } = useItems();

  return (
    <div className="page-container">
      <ItemHeader loading={loading} onRefresh={fetchItems} />
      <ItemTable items={items} loading={loading} error={error} />
    </div>
  );
};

export default ItemList;


