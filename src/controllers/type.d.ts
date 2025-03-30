type fieldsType = {
  path: string;
  field: string;
  message: string;
};

interface RequestBody {
  categoryId: string | number;
  title: string;
  content: string;
  imageUrl: string;
}

interface RequestBodyUsers {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}
