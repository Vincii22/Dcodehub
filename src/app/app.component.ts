import { Component } from '@angular/core';
import { Post } from './post/post.model'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedPost: Post = { _id: '', title: '', content: '', imageUrl: '' }; // Include imageUrl
  yourPostVariable: Post = { _id: '', title: '', content: '', imageUrl: '' }; // Include imageUrl
    
   //   this.storedPosts.push(post);
   // }
   posts: Post[] = [];
 
   onPostAdded(post: Post) {
     this.posts.push(post);
   }

  title = 'codehub';
}
