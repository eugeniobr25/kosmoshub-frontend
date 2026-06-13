import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  // Emite um evento sempre que o elemento âncora entrar na tela
  @Output() scrolled = new EventEmitter<void>();
  
  private element = inject(ElementRef);
  private observer!: IntersectionObserver;

  ngOnInit(): void {
    // rootMargin: '100px' significa que o evento dispara 100 pixels antes 
    // do usuário bater no final real da tela, garantindo fluidez.
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.scrolled.emit();
      }
    }, options);

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}