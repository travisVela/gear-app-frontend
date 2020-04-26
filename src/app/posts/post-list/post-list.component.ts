import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscribable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription
  isLoading = false;
  AuthSub: Subscription;
  userAuthenticated = false;
  userId: string;
  
  constructor(
    private ps: PostsService,
    private as: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.ps.getPosts();
    this.userId = this.as.getUserId();
    this.postsSub =  this.ps.getPostsUpdatedListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    })

    this.userAuthenticated = this.as.getIsAuth();

    this.AuthSub = this.as.getAuthStatusListener().subscribe(res => {
      this.userAuthenticated = res;
      this.userId = this.as.getUserId();
    })
  }

  onDelete(postId: string) {
    // this.isLoading = true;
    this.ps.deletePost(postId);
  }


  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }

    if (this.AuthSub) {
      this.AuthSub.unsubscribe();
    }
  }

}
