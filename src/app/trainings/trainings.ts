import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchBarComponent } from '../search-bar/search-bar-component/search-bar-component';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { ApiTraining } from '../model/api-training.model';


@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent, ReactiveFormsModule],
  templateUrl: './trainings.html',
  styleUrl: './trainings.css',
})
export class Trainings implements OnInit {

  searchKeyword = '';
  maxPrice?: number;

  trainings: ApiTraining[] = [];
  allTrainings: ApiTraining[] = [];

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  trainingForm!: FormGroup

  isEditing = false;
  formVisible = false;
  selectedTraining: ApiTraining | null = null;

  constructor(

    private cartService: CartService,
    private authService: AuthService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log('Current user:', this.authService.getAuthenticatedUser());
    //this.isAdmin = this.authService.isAdmin();
    console.log('Is admin?', this.isAdmin);

    this.apiService.getTrainings().subscribe({
      next: data => {
        this.allTrainings = data;
        this.trainings = data;
        this.cdr.markForCheck();
      },
      error: err => console.error('Erreur API Spring Boot :', err)
    });

  this.trainingForm = this.fb.group({
    id: [{ value: null, disabled: false }],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [1, Validators.required],

  });

  }

  filterTrainings(keyword: string): void {
    this.searchKeyword = keyword.toLowerCase();
    this.applyFilters();
  }

  quantities: { [key: number]: number } = {};

  addToCart(training: ApiTraining): void {
    const quantity = this.quantities[training.id] || 1;
    this.cartService.addToCart(training, quantity);
    this.quantities[training.id] = 1;
  }

  applyFilters(): void {
    this.trainings = this.allTrainings.filter(training => {

      const matchKeyword =
        training.name.toLowerCase().includes(this.searchKeyword) ||
        training.description.toLowerCase().includes(this.searchKeyword);

      const matchPrice =
        this.maxPrice == null ||
        training.price <= this.maxPrice;

      return matchKeyword && matchPrice && matchPrice;
    });
  }

  addTraining(): void {
    this.isEditing = false;
    this.selectedTraining = null;

    this.trainingForm.reset({
      id: null,
      name: '',
      description: '',
      price: null,
      quantity: 1
    });
  }

  openAddForm(): void {
    this.formVisible = true;
    this.isEditing = false;
    this.selectedTraining = null;
    this.trainingForm.reset({ quantity: 1 });
  }

  editTraining(training: ApiTraining): void {

    this.formVisible = true;
    this.isEditing = true;
    this.selectedTraining = training;
    this.trainingForm.patchValue(training);
  }

  saveTraining(): void {
    if (this.trainingForm.invalid) return;

    const formValue = this.trainingForm.getRawValue();

    const training: ApiTraining = {
      id: formValue.id,
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      quantity: formValue.quantity
    };

    if (this.isEditing) {
      this.apiService.putTraining(training.id, training).subscribe({
        next: updated => {
          const index = this.allTrainings.findIndex(t => t.id === updated.id);
          if (index !== -1) this.allTrainings[index] = updated;
          this.applyFilters();
          this.cancel();
          this.cdr.markForCheck();
        },
        error: err => console.error('Erreur modification :', err)
      });
    } else {
      this.apiService.postTraining(training).subscribe({
        next: newTraining => {
          this.allTrainings.push(newTraining);
          this.applyFilters();
          this.cancel();
          this.cdr.markForCheck();
        },
        error: err => console.error('Erreur ajout :', err)
    });
   }

  }

  cancel(): void {

    this.formVisible = false;
    this.isEditing = false;
    this.selectedTraining = null;
    this.trainingForm.reset();
  }

  deleteTraining(id: number): void {
    if (!confirm('Supprimer cette formation ?')) return;

    this.apiService.delTraining(id).subscribe({
      next: () => {
        this.trainings = this.trainings.filter(
          training => training.id !== id
        );

        this.allTrainings = this.allTrainings.filter(
          training => training.id !== id
        );
        this.cdr.markForCheck();
        console.log('Formation supprimée avec succès');
      },
      error: err => {
        console.error('Erreur lors de la suppression :', err);
      }
    });
  }

}
