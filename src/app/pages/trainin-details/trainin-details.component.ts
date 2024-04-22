import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-trainin-details',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './trainin-details.component.html',
  styleUrl: './trainin-details.component.css',
})
export class TraininDetailsComponent {
  training: any = {
    logo: '../assets/images/microsoft-logo.png',
    companyName: 'Microsoft',
    description:
      "As a Microsoft Full Stack Developer, you will play a pivotal role in designing, developing, and maintaining software applications using Microsoft technologies. You will focus on leveraging Microsoft's suite of tools, languages, and frameworks to create innovative solutions that address business needs and enhance user experiences. Your responsibilities will include collaborating with cross-functional teams, gathering requirements, writing clean and efficient code, conducting testing, and optimizing application performance. Additionally, you will stay updated on emerging Microsoft technologies and best practices to ensure the continued success of projects and contribute to the growth of the team.",
    responsibility: [
      'Develop and maintain software applications using Microsoft technologies such as .NET, ASP.NET, C#, SQL Server, and Azure.',
      'Collaborate with cross-functional teams to gather requirements, design solutions, and implement features.',
      'Create responsive and user-friendly front-end interfaces using HTML, CSS, JavaScript, and frameworks like Angular or React.',
      'Write clean, efficient, and well-documented code while adhering to coding standards and best practices.',
      'Conduct thorough testing and debugging to ensure the quality and reliability of applications.',
      'Optimize application performance and scalability through code refactoring, performance tuning, and caching strategies.',
      'Stay updated on emerging technologies, trends, and best practices in Microsoft development to continuously improve skills and stay competitive in the field.',
    ],
    qualification: [
      'University student in Computer Science, Software Engineering, or related field.',
      'GPA should be above 3.3 out of 4.',
      'Proven experience as a Full Stack Developer with a focus on Microsoft technologies.',
      'Proficiency in programming languages such as C#, JavaScript, and SQL.',
      'Strong understanding of Microsoft development tools and frameworks, including .NET, ASP.NET, and Entity Framework.',
      'Experience with front-end development technologies like HTML, CSS, and JavaScript, as well as popular frameworks like Angular or React.',
      'Familiarity with cloud platforms, particularly Microsoft Azure, for deployment and hosting of applications.',
      'Excellent problem-solving skills and attention to detail.',
      'Effective communication and teamwork skills to collaborate with cross-functional teams.',
      'Ability to work independently and manage multiple tasks in a fast-paced environment.',
      'Continuous learning mindset to stay updated on new technologies and best practices in software development.',
    ],
  };
}
