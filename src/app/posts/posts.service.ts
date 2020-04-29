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

  creatorName: string;
  creator: string;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getPosts() {
    return this.http.get<{message: string, posts: any}>(environment.api + '/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            creatorName: post.creatorName
          };
        });
      }))
      .subscribe((data) => {
        console.log(data);
        this.posts = data;
        this.postsUpdated.next([...this.posts]);
      })
    
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: string) {
    // const postOb: Post = {
    //   id: null,
    //   title: post.title,
    //   content: post.content
    // }

    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: Post }>(environment.api + '/api/posts', postData)
      .subscribe(data => {
        this.creator = data.post.creator;
        this.creatorName = data.post.creatorName;

        const post: Post = {
          id: data.post.id,
          title: title,
          content: content,
          imagePath: data.post.imagePath,
          creator: data.post.creator,
          creatorName: data.post.creatorName
        }
        // const id = res.postId;
        // console.log(id);
        // postOb.id = id;
        this.posts.push(post);
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
    return this.http.get<{ _id: string, title: string, content:string, imagePath: string, creator: string }>(environment.api + '/api/posts/' + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id)
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
          postData = {
          id: id,
          title: title,
          content: content,
          imagePath: image,
          creator: this.creator,
          creatorName: this.creatorName
        }
      }

    this.http.put(environment.api + '/api/posts/' + id, postData)
      .subscribe(res => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: '',
          creator: this.creator,
          creatorName: this.creatorName
        }
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }
}
