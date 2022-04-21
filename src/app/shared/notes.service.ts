import { Injectable } from '@angular/core';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  //this is the array that will hold the notes saved by the user
  notes: Note[] = new Array<Note>();

  constructor() { }

  //getter for all notes in the array. 
  getAll(){
    return this.notes;
  }

  //getter for the note
  get(id:number){
    return this.notes[id];
  }

  //getter for the notes Id 
  getId(note: Note){
    return this.notes.indexOf(note);
  }

  //adds a note to the notes array and returns the id of the note where id=index
  add(note:Note){
    let newLength = this.notes.push(note);
    //JavaScript has a zero point index, so the index of a new note will always be the length -1 
    let index=newLength-1;
    return index;
  }

  //updates a given note by passing in the id 
  update(id: number, title: string, body:string){
    let note=this.notes[id];
    note.title = title;
    note.body=body;
  }

  //deletes a specific note by passing in the id and using it as the index for the splice 
  delete(id: number){
    this.notes.splice(id, 1);
  }

}
