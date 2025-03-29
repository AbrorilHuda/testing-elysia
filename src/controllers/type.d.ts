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
