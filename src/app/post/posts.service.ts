import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();
    private apiUrl = 'http://localhost:3000/api/posts';
    private currentPage = 1;
    private postsPerPage = 10;

    constructor(private http: HttpClient) {}

    setCurrentPage(page: number): void {
        this.currentPage = page;
    }

    getCurrentPage(): number {
        return this.currentPage;
    }

    setPostsPerPage(postsPerPage: number): void {
        this.postsPerPage = postsPerPage;
    }

    getPostsPerPage(): number {
        return this.postsPerPage;
    }

    getAllPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(this.apiUrl);
    }

    getPosts() {
        this.http.get<{ message: string; posts: Post[] }>(this.apiUrl).subscribe(data => {
            this.posts = data.posts;
            this.postUpdated.next([...this.posts]);
        });
        return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    addPost(_id: string, title: string, content: string, imageUrl: string): Observable<{ message: string }> {
        const post: Post = { _id: _id, title: title, content: content, imageUrl: imageUrl };
        return this.http.post<{ message: string }>(this.apiUrl, post);
    }

    deletePost(_id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${_id}`);
    }

    updatePost(id: string, title: string, content: string, imageUrl: string): Observable<Post> {
        const postData = { title: title, content: content, imageUrl: imageUrl };
        return this.http.put<Post>(`${this.apiUrl}/${id}`, postData).pipe(
            catchError(error => {
                console.error('Error updating post:', error);
                return throwError(() => error);
            })
        );
    }

    updatePostWithImage(id: string, title: string, content: string, image: File): Observable<Post> {
        const formData = new FormData();
        formData.append('image', image, image.name);
        formData.append('title', title);
        formData.append('content', content);
    
        // Send the image file to the backend for upload
        return this.http.post<{ message: string, imageUrl: string }>(`${this.apiUrl}/upload`, formData).pipe(
            switchMap(response => {
                // Use the new image URL to update the post
                return this.http.put<Post>(`${this.apiUrl}/${id}`, {
                    title: title,
                    content: content,
                    imageUrl: response.imageUrl // Use the new image URL from the backend
                });
            })
        );
    }
}