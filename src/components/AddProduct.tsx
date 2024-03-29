import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

type FormFields = {
  name: string;
  price: string;
};

interface UserData {
  username: string;
  token: string;
}

function AddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormFields>();

  const apiUrl = '/api/products/add';
  const auth = useAuthUser<UserData>();
  const token = auth?.token || '';

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
        console.log(responseData);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  return (
    <>
      <Link to={'/listProducts'}>CANCEL</Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('name', {
            required: 'This field is required',
          })}
          type="text"
          placeholder="Name"
        />
        {errors.name && <div className="form-error">{errors.name.message}</div>}
        <input
          {...register('price', {
            required: 'This field is required',
            pattern: {
              value: /\d+/,
              message: 'Only use numbers',
            },
          })}
          type="text"
          placeholder="Price"
        />
        {errors.price && (
          <div className="form-error">{errors.price.message}</div>
        )}
        <button type="submit">Submit</button>
        {errors.root && <div className="form-error">{errors.root.message}</div>}
      </form>
    </>
  );
}

export default AddProduct;
