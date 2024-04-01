import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { SubmitHandler, useForm } from 'react-hook-form';
import '../../../style/form.css';
import { useEffect } from 'react';

type FormFields = {
  name: string;
  price: string;
};

interface UserData {
  username: string;
  token: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface EditProductProps {
  isOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product;
}

function EditProduct({ isOpen, setModalOpen, product }: EditProductProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    reset,
  } = useForm<FormFields>();

  const apiUrl = `/api/products/edit/${product._id}`;
  const auth = useAuthUser<UserData>();
  const token = auth?.token || '';

  useEffect(() => {
    setValue('name', product.name);
    setValue('price', String(product.price));
  }, [isOpen]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const queryParams = new URLSearchParams({
      name: String(data.name),
      price: String(data.price),
    });
    const urlWithParams = `${apiUrl}?${queryParams.toString()}`;

    await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          if (response.status === 422) {
            setError('root', {
              message: 'This product name is already in use',
            });
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((responseData) => {
        setModalOpen(false);
        reset();
        console.log(responseData);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  return (
    <>
      <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-body">
          <div className="form-field">
            <input
              {...register('name', {
                required: 'This field is required',
              })}
              className="form-field"
              type="text"
            />
            <label>Name</label>
            {errors.name && (
              <div className="form-error">{errors.name.message}</div>
            )}
          </div>
          <div className="form-field">
            <input
              {...register('price', {
                required: 'This field is required',
                pattern: {
                  value: /^\d+(\.\d+|)$/,
                  message: 'Only use numbers',
                },
              })}
              className="form-field"
              type="text"
            />
            <label>Price</label>
            {errors.price && (
              <div className="form-error">{errors.price.message}</div>
            )}
          </div>
          <div className="form-errors">
            {errors.root && (
              <div className="form-error">{errors.root.message}</div>
            )}
          </div>
        </div>
        <div className="form-footer">
          <button disabled={isSubmitting} type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default EditProduct;
