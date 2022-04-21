import { NotesService } from './../../shared/notes.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { animate, query, stagger, style, transition, trigger, } from '@angular/animations';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      //Entry animation (asterisk is a wildcard in angular. void=>*  essentially 
      //means this goes from not existing in the dom to existing )
      transition('void => *',[
        //intial state
        style({
          height:0,
          opacity:0,
          transform:'scale(0.85)',
          'margin-bottom':0,
          //expand out the paddding properties
          paddingTop: 0,
          paddingBottom:0,
          paddingRight:0,
          paddingLeft:0,
        }),
        //first want to animate the spacing (includes height and margin)
        // the * is a wildcard that means the animation will take the full height  of the element
        animate('50ms',style({
          height:'*',
          'margin-bottom': '*',
          paddingTop:'*',
          paddingBottom:'*',
          paddingRight:'*',
          paddingLeft:'*',
        })),
        animate(200)
      ]),
      //delete animation
      transition('* => void', [
        //scale up
        animate(50, style({
          transform: 'scale(1.05',          
        })),
        //scale down to normal size while fade out 
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75,
        })),
        //scale down and fade out 
        animate('120ms ease-out', style({
          opacity:0,
          transform:'scale(0.68)',
        })),
        //animate the spacing out (includes height margin and padding)
        animate('150ms ease-out', style({
          height:0,
          paddingTop:0,
          paddingBottom:0,
          paddingRight:0,
          paddingLeft:0,
          'margin-bottom':'0',
        }))
      ])
    ]),
    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity:0,
            height:0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  @ViewChild('filterInput')
  filterInputElRef!: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    //retrieves all notes from the notesService
    this.notes = this.notesService.getAll();
    // this.filteredNotes = this.notesService.getAll();
    this.filter('');

  }

  deleteNote(note: Note ){
    let noteId = this.notesService.getId(note);
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  generateNoteURL(note: Note){
    let noteId = this.notesService.getId(note);
    return noteId;
  }


  filter(query: string) {
   
    query = query.toLowerCase().trim();
    let allResults: Note[] = new Array<Note>();
    //split up search query into individual words split by spaces
    let terms: string[] = query.split(' ');
    //remove duplicate search terms
    terms = this.removeDuplicates(terms);
    //gather all relevant results into allresults array
    terms.forEach(term => {
      let results = this.relevantNotes(term);
      //append results to the allResults array
      allResults = [...allResults,...results]
    })
    //allResults will include duplucate notes
    //so duplicates must be removed
    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;
    //use the relevancy method
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>) : Array<any>{
    let uniqueResults: Set<any> = new Set<any>();
    //loops through input array and add items to set
    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note>{
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if(note.title && note.title.toLowerCase().includes(query)){
        return true
      }
      if(note.body && note.body.toLowerCase().includes(query)){
        return true;
      }
      return false;
    })
    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]){
    //determine of relevancy based on he number of times it appears in search results
    //format - key: value => NoteId:nuumber (note object id: count )
    let noteCountObj: any = {};
    searchResults.forEach(note => {
      //get the notes id
      let noteId = this.notesService.getId(note);
      if(noteCountObj[noteId]){
        noteCountObj[noteId] += 1;
      }
      else {
        noteCountObj[noteId] = 1;
      }
    })
    this.filteredNotes = this.filteredNotes.sort((a:Note, b:Note )=>{
      let aId = this.notesService.getId(a);
      let bId = this.notesService .getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];
      return bCount - aCount;

    })
  }
}
