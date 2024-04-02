import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import FormCSS from '../../../style/form.module.css';
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
    try {
      setIsLoading(true);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(
          'Failed to delete product. Server responded with status:',
          response.status
        );
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setIsLoading(false);
      setModalOpen(false);
      console.log(responseData);
    } catch (error) {
      console.error('There was a problem with the delete operation:', error);
      alert('Failed to delete product. Please try again later.');
    }
  };

  return (
    <>
      <div className={FormCSS.modalForm}>
        <div className={FormCSS.formBody}>
          <div>Are you sure? This action cannot be undone</div>
        </div>
        <div className={FormCSS.formFooter}>
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
