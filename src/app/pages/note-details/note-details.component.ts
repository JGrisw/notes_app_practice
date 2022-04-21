import { NotesService } from './../../shared/notes.service';
import { Note } from './../../shared/note.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {

  note!: Note;
  noteId!: number;
  new!: boolean;

  constructor(private notesService: NotesService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {

    //checks whether new note is being created or editing existing note. if new, creates a new note
    this.route.params.subscribe((params:Params) => {
      this.note= new Note();
      if(params['id']){
        this.note = this.notesService.get(params['id']);
        this.noteId = params['id'];
        this.new=false;
      } 
      else {
        //boolean flag for new notes
        this.new= true;
      }
    })

    
  }

  onSubmit(form: NgForm){
    if(this.new){
      //save the new note
    this.notesService.add(form.value);
    
    } else {
      //updates the note if not new 
      this.notesService.update(this.noteId, form.value.title, form.value.body)
    }
    //navigates back to the home page after either option
    this.router.navigateByUrl('/');
  }

  cancel(){
    //cancel withtout saving anything and reroutes to the main page 
    this.router.navigateByUrl('/');
  }

}
