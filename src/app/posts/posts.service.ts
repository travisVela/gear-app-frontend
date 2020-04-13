import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPosts() {
    return this.http.get<{message: string, posts: any}>(environment.api + '/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((data) => {
        this.posts = data;
        this.postsUpdated.next([...this.posts]);
      })
    
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    const postOb: Post = {
      id: null,
      title: post.title,
      content: post.content
    }
    this.http.post<{ message: string, postId: string }>(environment.api + '/api/posts', post)
      .subscribe(res => {
        const id = res.postId;
        console.log(id);
        postOb.id = id;
        this.posts.push(postOb);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/'])
      });
  }

  deletePost(postId: string) {
    this.http.delete(environment.api + '/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => 
          post.id !== postId);
          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);
      })
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content:string }>(environment.api + '/api/posts/' + id);
  }

  updatePost(id: string, post: Post) {
    const postOb: Post = {
      id: id,
      title: post.title,
      content: post.content
    }

    this.http.put(environment.api + '/api/posts/' + id, postOb)
      .subscribe(res => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === postOb.id);
        updatedPosts[oldPostIndex] = postOb;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }
}
