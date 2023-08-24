import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { OrgChartModule } from 'angular13-organization-chart';
import { Observable, Subscription } from 'rxjs';
import { ITreeNode } from 'src/app/interfaces/ITreeNode.interface';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-organigrama-interno',
  templateUrl: './organigrama-interno.component.html',
  standalone: true,
  imports: [OrgChartModule, CommonModule],
  providers: [ToastService],
})
export default class OrganigramaInternoComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public toastService = inject(ToastService);

  baseUrlImg = environment.base_urlImg;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  tree: ITreeNode;
  subRef$: Subscription;

  onLoadData(customerId: number) {
    this.subRef$ = this.dataService
      .get('OrganigramaInterno/' + customerId)
      .subscribe({
        next: (resp: any) => {
          this.tree = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnInit() {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData(this.customerIdService.customerId);
    this.customerId$.subscribe((resp) => {
      this.onLoadData(this.customerIdService.customerId);
    });
  }

  treeEjemplo: ITreeNode = {
    name: 'RESIDENCIAL CITADEL',
    description: '',
    children: [
      {
        name: 'Felines',
        description: 'Cute playful animals',
        image: 'assets/chart-images/1.png',
        children: [
          {
            name: 'Lion',
            image: 'assets/chart-images/6.png',
            children: [],
          },
          {
            name: 'Tiger',
            cssClass: 'yellow-on-hover',
            image: 'assets/chart-images/4.jpg',
            children: [],
          },
          {
            name: 'Cheetah',
            image: 'assets/chart-images/8.png',
            children: [],
          },
          {
            name: 'Big Cats',
            image: 'assets/chart-images/3.jpg',
            css: 'background-color: #999999',
            children: [
              {
                name: 'Lion',
                image: 'assets/chart-images/6.png',
                children: [],
              },
              {
                name: 'Tiger',
                cssClass: 'yellow-on-hover',
                image: 'assets/chart-images/4.jpg',
                children: [],
              },
              {
                name: 'Cheetah',
                image: 'assets/chart-images/8.png',
                children: [],
              },
            ],
          },
          {
            name: 'Small Cats',
            description:
              'Cute, but can also be crude. Like when they defecate on your lap, that would be a good example of crudeness on their part',
            image: 'assets/chart-images/9.png',
            children: [
              {
                name: 'House Cat',
                image: 'assets/chart-images/7.png',
                children: [],
              },
              {
                name: 'Street Cat',
                image: 'assets/chart-images/8.png',
                children: [
                  {
                    name: 'Dumb Cat',
                    image: 'assets/chart-images/13.png',
                    children: [
                      {
                        name: 'Sorry For Bad Example',
                        image: 'assets/chart-images/6.png',
                        children: [],
                      },
                    ],
                  },
                  {
                    name: 'Good Cat',
                    image: 'assets/chart-images/8.png',
                    children: [
                      {
                        name: 'Binary Search Tree',
                        image: 'assets/chart-images/10.png',
                        children: [
                          {
                            name: '7',
                            image: 'assets/chart-images/11.png',
                            children: [
                              {
                                name: '3',
                                image: 'assets/chart-images/6.png',
                                children: [
                                  {
                                    name: '2',
                                    image: 'assets/chart-images/7.png',
                                    children: [],
                                  },
                                  {
                                    name: '5',
                                    image: 'assets/chart-images/12.png',
                                    children: [],
                                  },
                                ],
                              },
                              {
                                name: '13',
                                description: 'An odd yet funny number.',
                                image: 'assets/chart-images/14.png',
                                children: [
                                  {
                                    name: '11',
                                    description:
                                      'All nodes to the right are greater',
                                    image: 'assets/chart-images/15.png',
                                    children: [],
                                  },
                                  {
                                    name: '17',
                                    image: 'assets/chart-images/13.png',
                                    description:
                                      'This number is less that 17.00000001',
                                    children: [],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'Fake Cats',
            image: 'assets/chart-images/5.png',
            children: [],
            onClick: () => console.log('Google chrome stole some RAM'),
          },
        ],
      },
      {
        name: 'Felines',
        description: 'Cute playful animals',
        image: 'assets/chart-images/1.png',
        children: [],
      },
    ],
  };
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
