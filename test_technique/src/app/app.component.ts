import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

interface Characters {
  id: number;
  firstName: string;
  lastName: string;
  description: string;
  arrivalDate: string;
  house: string;
  assignment?: string;
  isTeacher: boolean;
}

function parseArrivalDate(dateString: string): Date {
  const [day, monthString, year] = dateString.split('/');
  const month = parseInt(monthString) - 1;
  return new Date(+year, month, +day); 
}  

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlexLayoutModule, CommonModule, NgFor, HttpClientModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit{
  title = 'Hogwarts';
  characters: Characters[] = [];
  teachers: Characters[] = [];
  teachersOrdered: Characters[] = [];
  students: Characters[] = [];
  studentsGryffindor: Characters[] = [];
  studentsSlytherin: Characters[] = [];
  studentsAlphabeticalOrderedGryffindor: Characters[] = [];
  studentsAlphabeticalOrderedSlytherin: Characters[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Characters[]>('assets/data.json').subscribe((data) => {
      this.characters = data;
      this.teachers = this.characters.filter((character) => character.isTeacher);
      this.teachersOrdered = this.teachers.sort((a, b) => {const dateA = parseArrivalDate(a.arrivalDate);
        const dateB = parseArrivalDate(b.arrivalDate);
        const timeA = dateA.getTime();
        const timeB = dateB.getTime();
        return timeA - timeB;});
      this.students = this.characters.filter((character) => !character.isTeacher);
      this.studentsGryffindor = this.students.filter((student) => student.house === 'Gryffindor')
      this.studentsSlytherin = this.students.filter((student) => student.house === 'Slytherin')
      this.studentsAlphabeticalOrderedGryffindor = this.studentsGryffindor.sort((a, b) => a.firstName.localeCompare(b.firstName));
      this.studentsAlphabeticalOrderedSlytherin = this.studentsSlytherin.sort((a, b) => a.firstName.localeCompare(b.firstName));
    });
  }  

 /* teachersTag = [
    { assignment: 'Transfiguration', colorClass: 'red-background' },
    { assignment: 'Charms', colorClass: 'blue-background' },
    { assignment: 'Potion', colorClass: 'green-background' },
    { assignment: 'Herbology', colorClass: 'yellow-background' },
  ];*/

}


