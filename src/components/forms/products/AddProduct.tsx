import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { SubmitHandler, useForm } from 'react-hook-form';
import FormCSS from '../../../style/form.module.css';
import { useEffect } from 'react';

type FormFields = {
  name: string;
  price: string;
};

interface UserData {
  username: string;
  token: string;
}

interface AddProductProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

function AddProduct({ isOpen, setModalOpen }: AddProductProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormFields>();

  const apiUrl = '/api/products/add';
  const auth = useAuthUser<UserData>();
  const token = auth?.token || '';

  useEffect(() => {
    reset();
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
      <form className={FormCSS.modalForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={FormCSS.formBody}>
          <div className={FormCSS.formField}>
            <input
              {...register('name', {
                required: 'This field is required',
              })}
              className={FormCSS.formField}
              type="text"
            />
            <label>Name</label>
            {errors.name && (
              <div className={FormCSS.formError}>{errors.name.message}</div>
            )}
          </div>
          <div className={FormCSS.formField}>
            <input
              {...register('price', {
                required: 'This field is required',
                pattern: {
                  value: /^\d+(\.\d+|)$/,
                  message: 'Only use numbers',
                },
              })}
              className={FormCSS.formField}
              type="text"
            />
            <label>Price</label>
            {errors.price && (
              <div className={FormCSS.formError}>{errors.price.message}</div>
            )}
          </div>
          <div className={FormCSS.formError}>
            {errors.root && (
              <div className={FormCSS.formError}>{errors.root.message}</div>
            )}
          </div>
        </div>
        <div className={FormCSS.formFooter}>
          <button disabled={isSubmitting} type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default AddProduct;
