# Full Stack Java Developer Portfolio

A professional, recruiter-ready portfolio website built with vanilla HTML5, CSS3, and JavaScript. This single-page portfolio showcases full-stack Java development skills with a clean, modern, enterprise-style design.

## Features

- **Fully Responsive**: Mobile-first design that works on all devices
- **Smooth Scrolling**: JavaScript-powered smooth scroll navigation
- **Active Navigation**: Highlights current section on scroll
- **Form Validation**: Client-side form validation with error messages
- **Modern UI**: Clean, professional design with subtle animations
- **SEO Friendly**: Semantic HTML5 structure
- **Fast Loading**: No frameworks, pure vanilla JavaScript

## Project Structure

```
portfoliio/
├── index.html      # Main HTML file with all sections
├── style.css       # All styling and responsive design
├── script.js       # Interactive features and form validation
└── README.md       # This file
```

## Sections

1. **Header/Navigation** - Sticky navigation bar with active link highlighting
2. **Hero Section** - Introduction with call-to-action buttons
3. **About Me** - Professional overview and expertise
4. **Skills** - Categorized skill cards (Backend, Frontend, Databases, Tools)
5. **Projects** - Detailed project cards with architecture and tech stack
6. **Experience & Education** - Work experience and educational background
7. **Contact** - Contact form with validation and social links
8. **Footer** - Copyright and social media links

## Tech Stack Highlighted

- **Backend**: Java, Spring Boot, REST APIs, Spring Security, JWT, Hibernate, JPA
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Databases**: MongoDB, MySQL
- **Tools**: Git, GitHub, Docker, Postman
- **Deployment**: Vercel, Netlify, Render

## Customization

### Update Personal Information

1. **Name and Role**: Edit the `.nav__name` and `.nav__role` in the header
2. **Hero Section**: Update name, title, and description in the hero section
3. **About Section**: Modify the professional overview paragraphs
4. **Projects**: Update project details, GitHub links, and descriptions
5. **Experience**: Edit work experience and education details
6. **Contact**: Update email, LinkedIn, and GitHub links

### Update Links

- Replace `https://github.com/username` with your actual GitHub profile
- Replace `https://linkedin.com/in/johndoe` with your LinkedIn profile
- Update `john.doe@example.com` with your email address
- Update project GitHub repository links

### Color Scheme

The color scheme is defined in CSS variables at the top of `style.css`:

```css
:root {
    --primary-color: #2563eb;
    --primary-dark: #1d4ed8;
    --secondary-color: #64748b;
    /* ... more variables */
}
```

Modify these variables to change the color scheme throughout the site.

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### Netlify

1. Drag and drop the project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository

### Render

1. Create a new Static Site
2. Connect your repository
3. Set build command: (none needed for static site)
4. Set publish directory: `/`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available for personal use.

## Contributing

Feel free to fork this project and customize it for your own portfolio!

---

**Note**: Remember to update all placeholder information (name, email, links, projects) with your actual details before deploying.

