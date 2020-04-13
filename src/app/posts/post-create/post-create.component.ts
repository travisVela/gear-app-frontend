import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';
  mode = 'create';
  private postId = ''
  post: Post;
  isLoading = false;
  form: FormGroup;

  constructor(
    public ps: PostsService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      
    })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.isLoading = true;
        this.ps.getPost(this.postId).subscribe(res => {
          this.isLoading = false;
          this.post = {
            id: res._id,
            title: res.title,
            content: res.content
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          })
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const post: Post = {
      id: this.postId,
      title: this.form.value.title,
      content: this.form.value.content
    }

    if (this.mode === 'create') {
      this.ps.addPost(post);
    } else {
      this.ps.updatePost(this.postId, post);
    }
   this.form.reset();
  }

}
