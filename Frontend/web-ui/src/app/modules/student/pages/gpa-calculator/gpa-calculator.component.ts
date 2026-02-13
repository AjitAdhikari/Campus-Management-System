import { Component, OnInit } from '@angular/core';

interface SubjectEntry {
    creditHours: number;
    gradePoint: number;
}

@Component({
    selector: 'app-gpa-calculator',
    templateUrl: './gpa-calculator.component.html',
    styleUrls: ['./gpa-calculator.component.css']
})
export class GpaCalculatorComponent implements OnInit {
    subjects: SubjectEntry[] = [
        { creditHours: -1, gradePoint: -1 }
    ];

    grades = [
        { label: 'A', value: 4.0 },
        { label: 'A-', value: 3.7 },
        { label: 'B+', value: 3.3 },
        { label: 'B', value: 3.0 },
        { label: 'B-', value: 2.7 },
        { label: 'C+', value: 2.3 },
        { label: 'C', value: 2.0 },
        { label: 'C-', value: 1.7 },
        { label: 'D+', value: 1.3 },
        { label: 'D', value: 1.0 },
        { label: 'F', value: 0.0 },
    ];

    credits = [1, 2, 3, 4];

    sgpa: number | null = null;
    errorMessage: string | null = null;

    constructor() { }

    ngOnInit(): void {
    }

    addSubject() {
        this.subjects.push({ creditHours: -1, gradePoint: -1 });
    }

    removeSubject(index: number) {
        if (this.subjects.length > 1) {
            this.subjects.splice(index, 1);
        } else {
            this.subjects[0] = { creditHours: -1, gradePoint: -1 };
        }
        this.calculateSGPA();
    }

    calculateSGPA() {
        let totalQualityPoints = 0;
        let totalCreditHours = 0;
        let validRows = 0;

        this.errorMessage = null;

        this.subjects.forEach(subject => {
            if (subject.creditHours > 0 && subject.gradePoint >= 0) {
                totalQualityPoints += (Number(subject.gradePoint) * Number(subject.creditHours));
                totalCreditHours += Number(subject.creditHours);
                validRows++;
            }
        });

        if (totalCreditHours > 0) {
            this.sgpa = totalQualityPoints / totalCreditHours;
        } else {
            this.sgpa = null;
            if (validRows === 0) {
                this.errorMessage = "Please select Credit Hours and Grade for at least one subject.";
            }
        }
    }
}
