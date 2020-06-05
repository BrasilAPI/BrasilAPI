interface IReturnError {
  name: string;
  message: string;
  type: string;
}

function ReturnError({ name, message, type }: IReturnError) {
  return {
    name,
    message,
    type,
  };
}

export default ReturnError;
