import { useState, useEffect } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from '../components/Dropdown';
import Paginator from '../components/Paginator';
import Modal from '../components/Modal';
import FilterDropdown from '../components/FilterDropdown';
import AddProduct from '../components/AddProduct';
import '../style/list.css';
import '../style/base.css';
import {
  faAdd,
  faEdit,
  faFilter,
  faSearch,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import EditProduct from '../components/EditProduct';
import DeleteProduct from '../components/DeleteProduct';

interface UserData {
  username: string;
  token: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Filter {
  value: string | number;
  label: string;
}

function ListProducts() {
  /* State Variables */
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('');
  const [orderBy, setOrderBy] = useState<Filter>({
    value: '_id',
    label: 'Default',
  });
  const [order, setOrder] = useState<Filter>({
    value: 'asc',
    label: 'Ascending',
  });
  const [limit, setLimit] = useState<Filter>({
    value: 5,
    label: '5',
  });
  const [totalProducts, setTotalProducts] = useState(0);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);
  const [changeProduct, setChangeProduct] = useState<Product>({
    _id: '',
    name: '',
    price: 0,
  });

  /* API Fetch configuration */
  const auth = useAuthUser<UserData>();
  const token = auth?.token || '';
  const apiUrl = '/api/products';

  /* Get the items from API */
  const fetchProducts = async () => {
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit.value),
      filterName: filter,
      orderby: String(orderBy.value),
      order: String(order.value),
    });
    const urlWithParams = `${apiUrl}?${queryParams.toString()}`;
    console.log(urlWithParams);

    await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        setIsLoading(false);
        setProducts(responseData.result.payload);
        setTotalPages(responseData.result.pages);
        setTotalProducts(responseData.result.total);

        console.log(products);
        return responseData;
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  /* Handle the submit event for searchbar */
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchProducts();
  };

  const resetSearch = () => {
    setFilter('');
  };

  /* Fetch products again when state changes */
  useEffect(() => {
    fetchProducts();
  }, [
    page,
    orderBy,
    order,
    limit,
    filter,
    isAddProductModalOpen,
    isEditProductModalOpen,
    isDeleteProductModalOpen,
  ]);

  /* Reset page to 1 after searching or changing the limit */
  useEffect(() => {
    setPage(1);
  }, [limit, filter]);

  /* JSX Rendering */
  return (
    <>
      <div className="table-container">
        {/* Header and Searchbar */}
        <div className="header">
          <div className="title">Products</div>
          <div className="header-actions">
            <div className="searchbar">
              {filter != '' && (
                <button className="link" onClick={() => resetSearch()}>
                  Clear Search
                </button>
              )}
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <button className="search-button" type="submit">
                  <FontAwesomeIcon className="icon" icon={faSearch} />
                </button>
              </form>
            </div>
            <button
              className="add-button"
              onClick={() => setIsAddProductModalOpen(true)}
            >
              <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
            </button>
          </div>
          {/* <SignOutButton></SignOutButton> */}
        </div>

        {/* Filters */}
        <div className="filters">
          <Dropdown
            label={'Order by'}
            placeholder="Order by"
            options={[
              { label: 'Default', value: '_id' },
              { label: 'Price', value: 'price' },
              { label: 'Name', value: 'name' },
            ]}
            setSelected={setOrderBy}
            selected={orderBy}
          ></Dropdown>
          <Dropdown
            placeholder="Order"
            options={[
              { label: 'Ascending', value: 'asc' },
              { label: 'Descending', value: 'desc' },
            ]}
            setSelected={setOrder}
            selected={order}
          ></Dropdown>
        </div>

        {/* Table */}
        <div className={isLoading ? 'active table-outline' : 'table-outline'}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '100%' }}>Name</th>
                <th style={{ minWidth: '100px', maxWidth: '100px' }}>Price</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.name}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td className="actions">
                    <button
                      onClick={() => {
                        setIsEditProductModalOpen(true);
                        setChangeProduct(product);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteProductModalOpen(true);
                        setChangeProduct(product);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={isLoading ? 'active loading' : 'loading'}>
            Loading...
          </div>
        </div>

        {/* Page Navigator */}
        <>
          <div className="item-number">
            <Dropdown
              label="Items per page"
              classList="short up"
              placeholder="Limit"
              options={[
                { label: '1', value: '1' },
                { label: '5', value: '5' },
                { label: '10', value: '10' },
                { label: '25', value: '25' },
                { label: '50', value: '50' },
              ]}
              setSelected={setLimit}
              selected={limit}
            ></Dropdown>
          </div>
          <div className="paginator">
            <Paginator
              currentPage={page}
              totalPages={totalPages}
              setPage={setPage}
            ></Paginator>
          </div>
          <div className="counter unselectable">
            Showing {page * Number(limit.value) - Number(limit.value) + 1}-
            {Math.min(page * Number(limit.value), totalProducts)} of{' '}
            {totalProducts}
          </div>
        </>

        {/* Mobile filters */}
        <>
          <div className="mobile-filters">
            <button
              className="add-button"
              onClick={() => setIsAddProductModalOpen(true)}
            >
              <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
            </button>
            <Dropdown
              customButton={
                <button className="add-button">
                  <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
                </button>
              }
              customContent={
                <div className="filter-menu">
                  <FilterDropdown
                    filterLabel="Order by"
                    states={[
                      {
                        filter: orderBy,
                        options: [
                          { label: 'Default', value: '_id' },
                          { label: 'Price', value: 'price' },
                          { label: 'Name', value: 'name' },
                        ],
                      },
                      {
                        filter: order,
                        options: [
                          { label: 'Ascending', value: 'asc' },
                          { label: 'Descending', value: 'desc' },
                        ],
                      },
                    ]}
                    stateSetters={[setOrderBy, setOrder]}
                  ></FilterDropdown>
                  <FilterDropdown
                    filterLabel="Items per Page"
                    states={[
                      {
                        filter: limit,
                        options: [
                          { label: '1', value: '1' },
                          { label: '5', value: '5' },
                          { label: '10', value: '10' },
                          { label: '25', value: '25' },
                          { label: '50', value: '50' },
                        ],
                      },
                    ]}
                    stateSetters={[setLimit]}
                  ></FilterDropdown>
                </div>
              }
            ></Dropdown>
          </div>
        </>
      </div>
      <Modal
        isOpen={isAddProductModalOpen}
        setIsOpen={setIsAddProductModalOpen}
      >
        <AddProduct
          isOpen={isAddProductModalOpen}
          setModalOpen={setIsAddProductModalOpen}
        ></AddProduct>
      </Modal>
      <Modal
        isOpen={isEditProductModalOpen}
        setIsOpen={setIsEditProductModalOpen}
      >
        <EditProduct
          isOpen={isEditProductModalOpen}
          product={changeProduct}
          setModalOpen={setIsEditProductModalOpen}
        ></EditProduct>
      </Modal>
      <Modal
        isOpen={isDeleteProductModalOpen}
        setIsOpen={setIsDeleteProductModalOpen}
      >
        <DeleteProduct
          product={changeProduct}
          setModalOpen={setIsDeleteProductModalOpen}
        ></DeleteProduct>
      </Modal>
    </>
  );
}

export default ListProducts;
