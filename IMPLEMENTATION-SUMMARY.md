# iHeartTheatre.com - Badge System Implementation Summary

## Overview
Successfully implemented a comprehensive badge system across the website that displays:
- **NEW badge** for reviews published within the last 7 days
- **Days Left badge** for shows that are still running (shows how many days remaining to see the show)

## Files Updated

### 1. reviews.html (Reviews Archive Page)
**Status**: ✅ Complete

**Features Implemented**:
- Dynamic review cards with badge system
- Filter buttons: All Reviews, Deanna's Reviews, Penelope's Reviews, New This Week, Still Available
- Badge calculation based on:
  - Published date (NEW badge if ≤ 7 days old)
  - Show end date (Days Left badge if show is still running)
- Click-to-navigate to individual review pages
- Responsive grid layout
- Achievement system for scroll engagement

**Badge Logic**:
```javascript
function calculateBadges(review) {
    const today = new Date();
    const publishedDate = new Date(review.publishedDate);
    const showEndDate = new Date(review.showEndDate);
    
    const daysSincePublished = Math.floor((today - publishedDate) / (1000 * 60 * 60 * 24));
    const daysUntilShowEnds = Math.floor((showEndDate - today) / (1000 * 60 * 60 * 24));
    
    const badges = [];
    
    // NEW badge if published within last 7 days
    if (daysSincePublished <= 7) {
        badges.push({ type: 'new', text: 'NEW' });
    }
    
    // Days left badge if show is still running
    if (daysUntilShowEnds >= 0) {
        badges.push({ type: 'days-left', text: `${daysUntilShowEnds} days left` });
    }
    
    return badges;
}
```

### 2. reviewers.html (Meet Our Reviewers Page)
**Status**: ✅ Complete

**Features Implemented**:
- Two reviewer sections (Deanna Amato & Penelope Quinn)
- Each section shows:
  - Reviewer profile with image, bio, and stats
  - All reviews by that reviewer with badges
  - Review cards with NEW and Days Left badges
- Click-to-navigate to individual review pages
- Responsive layout
- Achievement system

**Reviewer Sections**:
- **Deanna Amato**: 26 reviews displayed
- **Penelope Quinn**: 7 reviews displayed

### 3. index-v2.html (Homepage)
**Status**: ✅ Complete

**Features Implemented**:
- **Review Slideshow** (replaced static grid)
- Auto-advancing slideshow (5-second intervals)
- Navigation arrows and dot indicators
- Badge system integrated into slideshow cards
- Flip card animation for highlights
- Click-to-navigate to full reviews

**Slideshow Features**:
- 5 featured reviews in rotation
- Smooth transitions between slides
- Manual navigation (arrows + dots)
- Auto-play with pause on interaction
- Badge display on each slide

**CSS Additions**:
- Slideshow container and wrapper styles
- Navigation button styles (prev/next)
- Dot indicator styles
- Badge styles (NEW and Days Left)

## Badge Design

### NEW Badge
- **Style**: Purple gradient background (#667eea → #764ba2)
- **Text**: White (#f5f5f5)
- **Appearance**: Prominent, eye-catching
- **Purpose**: Highlight recently published content

### Days Left Badge
- **Style**: Gold background with border (rgba(255, 215, 0, 0.15))
- **Text**: Gold (#ffd700)
- **Appearance**: Urgent but elegant
- **Purpose**: Create urgency for shows still running

## Data Structure

Each review includes:
```javascript
{
    id: 'review-deanna-the-good-life',
    title: 'The Good Life',
    reviewer: 'Deanna Amato',
    venue: 'Brighton Theatre',
    company: 'Brighton Theatre Company',
    publishedDate: '2025-11-10',  // For NEW badge calculation
    showEndDate: '2025-11-23',     // For Days Left badge calculation
    category: 'Play',
    excerpt: 'Review excerpt...',
    image: 'REVIEWERS/Deanna/good-life-1.jpg'
}
```

## Badge Calculation Logic

### NEW Badge
- **Trigger**: Published within last 7 days
- **Calculation**: `(today - publishedDate) / (1000 * 60 * 60 * 24) <= 7`
- **Display**: Purple gradient badge with "NEW" text

### Days Left Badge
- **Trigger**: Show end date is today or in the future
- **Calculation**: `(showEndDate - today) / (1000 * 60 * 60 * 24) >= 0`
- **Display**: Gold badge with "X days left" text
- **Note**: Only shows if show is still running (not ended)

## User Experience

### Reviews Archive Page
1. Users see all reviews in a grid layout
2. Each review card shows relevant badges
3. Filters allow viewing by reviewer or badge type
4. Clicking a card navigates to full review

### Reviewers Page
1. Users see reviewer profiles with their reviews
2. Each review shows badges based on recency and availability
3. Clear separation between Deanna's and Penelope's reviews
4. Clicking a review navigates to full review

### Homepage Slideshow
1. Auto-rotating showcase of featured reviews
2. Each slide shows badges prominently
3. Users can navigate manually or let it auto-play
4. Flip cards reveal highlights
5. Clicking "Read Full Review" navigates to individual review

## Technical Implementation

### JavaScript Functions
- `calculateBadges(review)` - Determines which badges to show
- `renderReviews(filter)` - Renders review cards with badges
- `renderReviewerReviews(reviewerName, containerId)` - Renders reviewer-specific reviews
- `createSlide(review, index)` - Creates slideshow slides with badges
- `goToSlide(index)` - Navigates to specific slide
- `nextSlide()` / `prevSlide()` - Slideshow navigation

### CSS Classes
- `.badge` - Base badge styling
- `.badge-new` - NEW badge specific styling
- `.badge-days-left` - Days Left badge specific styling
- `.slideshow-container` - Slideshow wrapper
- `.slideshow-wrapper` - Sliding content area
- `.slideshow-nav` - Navigation buttons
- `.slideshow-dots` - Dot indicators

## Responsive Design
All pages are fully responsive:
- Desktop: Multi-column grids
- Tablet: 2-column layouts
- Mobile: Single-column layouts
- Slideshow adapts to all screen sizes

## Achievement System
All pages include scroll-based achievements:
- "Getting Into It" (25% scroll)
- "Dedicated Reader" (50% scroll)
- "True Theatre Lover" (75% scroll)
- "Renaissance Champion" (90% scroll + confetti)

## Next Steps (Optional Enhancements)
1. Add badge filtering to homepage slideshow
2. Implement badge-based sorting options
3. Add "Last Chance" badge for shows ending within 3 days
4. Create badge analytics dashboard
5. Add email notifications for new reviews with badges

## Testing Recommendations
1. Test badge calculations with various date scenarios
2. Verify slideshow auto-play and manual navigation
3. Test responsive behavior on different devices
4. Verify click-through to individual review pages
5. Test filter functionality on reviews page

## Notes
- All dates are calculated dynamically based on current date
- Badges update automatically as time passes
- No manual badge management required
- System is scalable for additional reviewers and reviews