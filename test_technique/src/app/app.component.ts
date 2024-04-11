import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { style } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';

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

interface AssignmentColorMap {
  [assignment: string]: string; 
}

function parseArrivalDate(dateString: string): Date {
  const [day, monthString, year] = dateString.split('/');
  const month = parseInt(monthString) - 1;
  return new Date(+year, month, +day); 
}  

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlexLayoutModule, CommonModule, NgFor, HttpClientModule, MatIconModule, MatCardModule],
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
  teachersT: Characters[] = [];
  teachersC: Characters[] = [];
  teachersP: Characters[] = [];
  teachersH: Characters[] = [];
  studentsYear: Characters[] = [];

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
      this.studentsGryffindor = this.students.filter((student) => student.house === 'Gryffindor');
      this.studentsSlytherin = this.students.filter((student) => student.house === 'Slytherin');
      this.studentsAlphabeticalOrderedGryffindor = this.studentsGryffindor.sort((a, b) => a.firstName.localeCompare(b.firstName));
      this.studentsAlphabeticalOrderedSlytherin = this.studentsSlytherin.sort((a, b) => a.firstName.localeCompare(b.firstName));
      this.teachersT = this.teachersOrdered.filter((teacher) => teacher.assignment === 'Transfiguration');
      this.teachersC = this.teachersOrdered.filter((teacher) => teacher.assignment === 'Charms');
      this.teachersP = this.teachersOrdered.filter((teacher) => teacher.assignment === 'Potion');
      this.teachersH = this.teachersOrdered.filter((teacher) => teacher.assignment === 'Herbology');
    });
  }

  chosenDate = new Date(1991, 10, 12)

  calculateYear(student: Characters): string {
    try {
      const arrivalDate = new Date(student.arrivalDate);
      const timeDifference = this.chosenDate.getTime() - arrivalDate.getTime();
  
      const years = Math.floor(timeDifference / (365 * 24 * 60 * 60 * 1000));
      switch (years){
        case 0:
          return 'First year'
        case 1: 
          return 'Second year'
        case 2: 
          return 'Third year'
      }
  
      return `${years}`;
    } catch (error) {
      console.error("Error calculating time here:", error);
      return "Invalid arrival date format";
    }
  }
}


