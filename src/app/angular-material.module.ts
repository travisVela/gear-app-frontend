import { NgModule } from '@angular/core';

import { 
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule
  } from '@angular/material';
  import { MatMenuModule } from '@angular/material/menu';
  import { MatIconModule } from '@angular/material/icon';

@NgModule({

    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatMenuModule,
        MatIconModule
    ]

})
export class AngularMaterialModule {}