import { useState, useEffect } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from '../components/common/Dropdown';
import Paginator from '../components/common/Paginator';
import Modal from '../components/common/Modal';
import FilterDropdown from '../components/common/FilterDropdown';
import AddProduct from '../components/forms/products/AddProduct';
import ListCSS from '../style/list.module.css';

import {
  faAdd,
  faX,
  faEdit,
  faFilter,
  faSearch,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import EditProduct from '../components/forms/products/EditProduct';
import DeleteProduct from '../components/forms/products/DeleteProduct';

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

    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit.value),
        filterName: filter,
        orderby: String(orderBy.value),
        order: String(order.value),
      });

      const urlWithParams = `${apiUrl}?${queryParams.toString()}`;
      console.log(urlWithParams);

      const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          'Failed to fetch products. Server responded with status ' +
            response.status
        );
      }

      const responseData = await response.json();
      setIsLoading(false);
      setProducts(responseData.result.payload);
      setTotalPages(responseData.result.pages);
      setTotalProducts(responseData.result.total);
    } catch (error) {
      setIsLoading(false);
      console.error('There was a problem with the fetch operation:', error);
      alert('Failed to fetch products. Please try again later.');
    }
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
      <div className={`${ListCSS.tableContainer}`}>
        {/* Header and Searchbar */}
        <div className={`${ListCSS.header}`}>
          <div className={`${ListCSS.title}`}>Products</div>
          <div className={`${ListCSS.headerActions}`}>
            <div className={`${ListCSS.searchbar}`}>
              {filter != '' && (
                <button
                  className={`${ListCSS.link}`}
                  onClick={() => resetSearch()}
                >
                  <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
                </button>
              )}
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <button className={`${ListCSS.searchButton}`} type="submit">
                  <FontAwesomeIcon
                    className={`${ListCSS.icon}`}
                    icon={faSearch}
                  />
                </button>
              </form>
            </div>
            <button
              className={`${ListCSS.addButton}`}
              onClick={() => setIsAddProductModalOpen(true)}
            >
              <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`${ListCSS.filters}`}>
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
        <div
          className={`${ListCSS.tableOutline} ${
            isLoading ? ListCSS.active : ''
          }`}
        >
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
                  <td className={`${ListCSS.actions}`}>
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
          <div
            className={`${ListCSS.loading} ${isLoading ? ListCSS.active : ''}`}
          >
            Loading...
          </div>
        </div>

        {/* Page Navigator */}
        <>
          <div className={`${ListCSS.itemNumber}`}>
            <Dropdown
              label="Items per page"
              isShort={true}
              isUp={true}
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
          <div className={`${ListCSS.paginator}`}>
            <Paginator
              currentPage={page}
              totalPages={totalPages}
              setPage={setPage}
            ></Paginator>
          </div>
          <div className={`${ListCSS.counter} unselectable`}>
            Showing {page * Number(limit.value) - Number(limit.value) + 1}-
            {Math.min(page * Number(limit.value), totalProducts)} of{' '}
            {totalProducts}
          </div>
        </>

        {/* Mobile filters */}
        <>
          <div className={`${ListCSS.mobileFilters}`}>
            <button
              className={`${ListCSS.addButton}`}
              onClick={() => setIsAddProductModalOpen(true)}
            >
              <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
            </button>
            <Dropdown
              customButton={
                <button className={`${ListCSS.addButton}`}>
                  <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
                </button>
              }
              customContent={
                <div className={`${ListCSS.filterMenu}`}>
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
        title="Add Product"
        isOpen={isAddProductModalOpen}
        setIsOpen={setIsAddProductModalOpen}
      >
        <AddProduct
          isOpen={isAddProductModalOpen}
          setModalOpen={setIsAddProductModalOpen}
        ></AddProduct>
      </Modal>
      <Modal
        title="Edit Product"
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
        title="Deleting Product"
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
