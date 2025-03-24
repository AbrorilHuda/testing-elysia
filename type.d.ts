type UserType = {
    id: number;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isActive: boolean;
    created_at: string;
    updated_at: string;
}

type CategoryType = {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

type BlogType = {
    id: number;
    title: string;
    userId: number;
    categoryId: number;
    imageUrl: string;
    content: string;
    created_at: string;
    updated_at: string;
    author: string;
}