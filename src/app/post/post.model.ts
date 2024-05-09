export interface Post {
    _id: string; // Use _id to match MongoDB's convention
    title: string;
    content: string;
    imageUrl: string;
}