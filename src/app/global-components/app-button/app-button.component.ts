import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cx } from '../utility/class-names';

type ButtonProps = {
  impact: 'bold' | 'light' | 'none';
  size: 'small' | 'medium' | 'large';
  shape: 'square' | 'rounded' | 'pill';
  tone: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'light';
};

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input() impact: ButtonProps['impact'] = 'none';
  @Input() size: ButtonProps['size'] = 'medium';
  @Input() shape: ButtonProps['shape'] = 'rounded';
  @Input() tone: ButtonProps['tone'] = 'primary';
  @Input() full: boolean = false;

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  public classes: string = '';

  baseClasses =
    'font-semibold focus-visible:outline-none flex items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50';

  impactClasses: Record<ButtonProps['tone'], Record<ButtonProps['impact'], string>> = {
    primary: {
      bold: 'bg-gradient-100 text-white shadow-md hover:bg-secondary-100/90 focus-visible:ring-secondary-100',
      light: 'bg-gradient-100/20 text-white hover:bg-secondary-100/30 focus-visible:ring-secondary-100',
      none: 'bg-transparent text-white hover:bg-secondary-100/10 focus-visible:ring-secondary-100',
    },
    danger: {
      bold: 'bg-destructive text-white shadow-md hover:bg-destructive/90 focus-visible:ring-destructive',
      light: 'bg-destructive/20 text-destructive hover:bg-destructive/30 focus-visible:ring-destructive',
      none: 'bg-transparent text-destructive hover:bg-destructive/10 focus-visible:ring-destructive',
    },
    success: {
      bold: 'bg-green-500 text-green-950 shadow-md hover:bg-green-600 focus-visible:ring-green-500',
      light: 'bg-green-500/20 text-green-600 hover:bg-green-500/30 focus-visible:ring-green-500',
      none: 'bg-transparent text-green-600 hover:bg-green-500/10 focus-visible:ring-green-500',
    },
    warning: {
      bold: 'bg-yellow-500 text-yellow-950 shadow-md hover:bg-yellow-600 focus-visible:ring-yellow-500',
      light: 'bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 focus-visible:ring-yellow-500',
      none: 'bg-transparent text-yellow-600 hover:bg-yellow-500/10 focus-visible:ring-yellow-500',
    },
    info: {
      bold: 'bg-violet-500 text-white shadow-md hover:bg-violet-600 focus-visible:ring-violet-500',
      light: 'bg-violet-500/20 text-violet-600 hover:bg-violet-500/30 focus-visible:ring-violet-500',
      none: 'bg-transparent text-violet-600 hover:bg-violet-500/10 focus-visible:ring-violet-500',
    },
    light: {
      bold: 'bg-secondary-200 text-primary shadow-md hover:bg-gradient-100/90 focus-visible:ring-gradient-100',
      light: 'bg-secondary-200/20 text-primary hover:bg-gradient-100 focus-visible:ring-gradient-100',
      none: 'bg-transparent text-primary hover:bg-gradient-100 focus-visible:ring-gradient-100',
    },
  };

  sizeClasses: Record<ButtonProps['size'], string> = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-5 py-2 text-sm',
    large: 'px-7 py-2.5 text-lg',
  };

  shapeClasses: Record<ButtonProps['shape'], string> = {
    square: 'rounded-none',
    rounded: 'rounded-lg',
    pill: 'rounded-full',
  };

  constructor() {}

  ngOnInit(): void {
    this.classes = cx(
      this.baseClasses,
      this.impactClasses[this.tone][this.impact],
      this.sizeClasses[this.size],
      this.shapeClasses[this.shape],
      this.full ? 'w-full' : '',
    );
  }

  onButtonClick() {
    this.buttonClick.emit();
  }
}
