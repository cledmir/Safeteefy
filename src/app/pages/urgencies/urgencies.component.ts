import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Urgency} from '../../models/urgency';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpDataService} from '../../services/http-data.service';
import {Router} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-urgencies',
  templateUrl: './urgencies.component.html',
  styleUrls: ['./urgencies.component.css']
})
export class UrgenciesComponent implements OnInit, AfterViewInit {
  @ViewChild('urgencyForm', { static: false })
  urgencyForm: NgForm;
  urgencyData: Urgency;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'title', 'summary', 'latitude', 'longitude', 'reportedAt'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isEditMode = false;
  guardianId: number;
  //
  constructor(private httpDataService: HttpDataService, private router: Router) {
    this.urgencyData = {} as Urgency;
  }

  ngOnInit(): void {
    this.guardianId = +(window.localStorage.getItem('id'));
    this.dataSource.sort = this.sort;
    this.getAllUrgencies(this.guardianId);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getAllUrgencies(guardianId): void {
    this.httpDataService.getAllUrgenciesByGuardian(guardianId).subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }
  editItem(element): void {
    console.log(element);
    this.urgencyData = _.cloneDeep(element);
    this.isEditMode = true;
  }
  cancelEdit(): void {
    this.isEditMode = false;
    this.urgencyForm.resetForm();
  }
  deleteItem(id): void {
    this.httpDataService.deleteUrgency(id, this.guardianId).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((o: Urgency) => {
        return o.id !== id ? o : false;
      });
    });
    console.log(this.dataSource.data);
  }
  addUrgency(): void {
    const newUrgency = {title: this.urgencyData.title, summary: this.urgencyData.summary, latitude: this.urgencyData.latitude,
      longitude: this.urgencyData.longitude, reportedAt: this.urgencyData.reportedAt, guardianId: this.guardianId };
    this.httpDataService.createUrgency(this.guardianId, newUrgency).subscribe((response: any) => {
      this.dataSource.data.push({...response});
      this.dataSource.data = this.dataSource.data.map(o => o);
    });
  }
  updateUrgency(): void {
    this.httpDataService.updateUrgency(this.urgencyData.id, this.guardianId, this.urgencyData)
      .subscribe((response: any) => {
        this.dataSource.data = this.dataSource.data.map((o: Urgency) => {
          if (o.id === response.id) {
            o = response;
          }
          return o;
        });
        this.cancelEdit();
      });
  }
  onSubmit(): void {
    if (this.urgencyForm.form.valid) {
      if (this.isEditMode) {
        this.updateUrgency();
      } else {
        this.addUrgency();
      }
    } else {
      console.log('Invalid Data');
    }
  }
  navigateToAddUrgency(): void {
    this.router.navigate([`guardians/${this.guardianId}/urgencies?new`]).then(() => null);
  }
  navigateToEditUrgency(urgencyId): void {
    this.router.navigate([`guardians/${this.guardianId}/urgencies/${urgencyId}`]).then(() => null);
  }
}

