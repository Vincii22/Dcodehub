import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { Post } from '../post.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
    enteredTitle = '';
    enteredContent = '';
    enteredImageUrl = ''; // To store the image URL from the input
    uploadedImageUrl: string = ''; // Initialize with an empty string
    @Output() postCreated = new EventEmitter<Post>();

    constructor(private postService: PostService, private router: Router) {}

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return;
        }
        const id = this.generateOrRetrieveId(); // Assuming this generates a unique ID for the new post
        const imageUrl = form.value.imageUrl || this.uploadedImageUrl;
        const post: Post = {
            _id: id,
            title: form.value.title,
            content: form.value.content,
            imageUrl: imageUrl
        };
        this.postService.addPost(post._id, post.title, post.content, post.imageUrl).subscribe(response => {
            console.log('Post added successfully:', response);
            form.resetForm();
            // Refresh the list of posts after successfully adding a new post
            this.postService.getPosts();
            this.uploadedImageUrl = '';
            // Navigate back to the post list page
            this.router.navigate(['/posts']);
        }, error => {
            console.error('Error adding post:', error);
        });
     }

    generateOrRetrieveId(): string {
        // Example: Generate a simple ID based on the current timestamp
        return Date.now().toString();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file) {
                // Here you would typically upload the file to a server and get a URL
                // For demonstration, we'll just read the file as a Data URL
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    // Assuming you want to set the uploadedImageUrl to the Data URL
                    this.uploadedImageUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }

}