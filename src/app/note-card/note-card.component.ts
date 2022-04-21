import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {

  //input used for the title of the note
  @Input('title')
  title!: string; 
  //input used for the body text of the note
  @Input('body')
  body!:string;
  @Input('link')
  link!:String;

  //event emitter used with the onXButtonClick method
  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  //used to created the truncated effect when the body of the note is too large
  @ViewChild('truncator', {static: true}) 
  truncator!: ElementRef<HTMLElement>; 
  @ViewChild('bodyText')
  bodyText!: ElementRef<HTMLElement>; 

  constructor(private renderer: Renderer2) { }

  ngOnInit() {

  }
  ngAfterViewInit(){
        //define the text overflow to show truncator
        let style = window.getComputedStyle(this.bodyText.nativeElement, null);
        let viewableHeight = parseInt(style.getPropertyValue("height"), 10);
    
        if(this.bodyText.nativeElement.scrollHeight > viewableHeight) {
          //if there is a text overflow show the truncator
          this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block')
        } else {
          //else there is no text overflow, hide fadeout truncator
          this.renderer.setStyle(this.truncator.nativeElement, 'display','none' )
        }
  }

  //method for deleting event
  onXButtonClick(){
    this.deleteEvent.emit();
  }

}
