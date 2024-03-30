import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import '../style/form.css';
import { useState } from 'react';

interface UserData {
  username: string;
  token: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface DeleteProductProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product;
}

function DeleteProduct({ setModalOpen, product }: DeleteProductProps) {
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = `/api/products/remove/${product._id}`;
  const auth = useAuthUser<UserData>();
  const token = auth?.token || '';

  const deleteProduct = async () => {
    setIsLoading(true);

    await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        setIsLoading(false);
        setModalOpen(false);
        console.log(responseData);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  return (
    <>
      <div className="modal-form">
        <div className="title">Deleting product. Are you sure?</div>
        <div>This action cannot be undone</div>
        <div className="form-body"></div>
        <div className="form-footer">
          <button disabled={isLoading} onClick={() => deleteProduct()}>
            Yes
          </button>
          <button disabled={isLoading} onClick={() => setModalOpen(false)}>
            No, go back
          </button>
        </div>
      </div>
    </>
  );
}

export default DeleteProduct;
