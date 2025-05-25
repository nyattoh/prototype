// Content Analyzer Unit Tests
const { yamlFixtures, placementExpectations } = require('./test/fixtures/yaml-samples.js');
const fs = require('fs');
const path = require('path');

// Load the content-analyzer.js file
const contentAnalyzerCode = fs.readFileSync(
  path.join(__dirname, 'content-analyzer.js'), 
  'utf8'
);

// Execute the code in a way that exposes the functions
let ContentAnalyzer;
const window = global;
eval(contentAnalyzerCode);
ContentAnalyzer = window.ContentAnalyzer;

describe('ContentAnalyzer', () => {
  describe('analyzeContent', () => {
    test('should detect book type from recipe content', () => {
      const { content, title } = yamlFixtures.book;
      const result = ContentAnalyzer.analyzeContent(content, title);
      expect(result).toBe(ContentAnalyzer.CONTENT_TYPES.BOOK);
    });

    test('should detect music type from audio content', () => {
      const { content, title } = yamlFixtures.music;
      const result = ContentAnalyzer.analyzeContent(content, title);
      expect(result).toBe(ContentAnalyzer.CONTENT_TYPES.MUSIC);
    });

    test('should detect art type from crystal content', () => {
      const { content, title } = yamlFixtures.art;
      const result = ContentAnalyzer.analyzeContent(content, title);
      expect(result).toBe(ContentAnalyzer.CONTENT_TYPES.ART);
    });

    test('should detect toy type from character content', () => {
      const { content, title } = yamlFixtures.toy;
      const result = ContentAnalyzer.analyzeContent(content, title);
      expect(result).toBe(ContentAnalyzer.CONTENT_TYPES.TOY);
    });

    test('should detect digital type from screen content', () => {
      const { content, title } = yamlFixtures.digital;
      const result = ContentAnalyzer.analyzeContent(content, title);
      expect(result).toBe(ContentAnalyzer.CONTENT_TYPES.DIGITAL);
    });

    test('should default to misc type for unknown content', () => {
      const { content, title } = yamlFixtures.misc;
      const result = ContentAnalyzer.analyzeContent(content, title);
      expect(result).toBe(ContentAnalyzer.CONTENT_TYPES.MISC);
    });

    test('should handle empty content', () => {
      const result = ContentAnalyzer.analyzeContent('', '');
      expect(result).toBe(ContentAnalyzer.CONTENT_TYPES.MISC);
    });

    test('should be case insensitive', () => {
      const result = ContentAnalyzer.analyzeContent('RECIPE: BOOK', 'RECIPE');
      expect(result).toBe(ContentAnalyzer.CONTENT_TYPES.BOOK);
    });
  });

  describe('getPlacementStyle', () => {
    test('should return book placement with rotation', () => {
      const style = ContentAnalyzer.getPlacementStyle(ContentAnalyzer.CONTENT_TYPES.BOOK, 0);
      
      expect(style).toHaveProperty('top');
      expect(style).toHaveProperty('left');
      expect(style).toHaveProperty('transform');
      expect(style.transform).toContain('perspective');
      expect(style.transform).toContain('rotateY');
    });

    test('should return music placement with scale', () => {
      const style = ContentAnalyzer.getPlacementStyle(ContentAnalyzer.CONTENT_TYPES.MUSIC, 0);
      
      expect(style).toHaveProperty('top');
      expect(style).toHaveProperty('right');
      expect(style).toHaveProperty('transform');
      expect(style.transform).toContain('scale');
    });

    test('should return art placement centered', () => {
      const style = ContentAnalyzer.getPlacementStyle(ContentAnalyzer.CONTENT_TYPES.ART, 0);
      
      expect(style).toHaveProperty('top');
      expect(style).toHaveProperty('left', '50%');
      expect(style).toHaveProperty('transform');
      expect(style.transform).toContain('translateX(-50%)');
    });

    test('should cycle through placement variations', () => {
      const style0 = ContentAnalyzer.getPlacementStyle(ContentAnalyzer.CONTENT_TYPES.BOOK, 0);
      const style1 = ContentAnalyzer.getPlacementStyle(ContentAnalyzer.CONTENT_TYPES.BOOK, 1);
      const style3 = ContentAnalyzer.getPlacementStyle(ContentAnalyzer.CONTENT_TYPES.BOOK, 3);
      
      // Should cycle back to first placement (index 0) when index 3
      expect(style0).toEqual(style3);
      expect(style0).not.toEqual(style1);
    });

    test('should handle unknown content type', () => {
      const style = ContentAnalyzer.getPlacementStyle('unknown', 0);
      
      expect(style).toHaveProperty('top', '50%');
      expect(style).toHaveProperty('left', '50%');
      expect(style).toHaveProperty('transform', 'translate(-50%, -50%)');
    });
  });

  describe('applyPlacementStyle', () => {
    test('should apply styles to DOM element', () => {
      // Create a mock DOM element
      const element = {
        style: {},
        classList: {
          add: jest.fn()
        }
      };
      
      ContentAnalyzer.applyPlacementStyle(element, ContentAnalyzer.CONTENT_TYPES.BOOK, 0);
      
      expect(element.style.top).toBeDefined();
      expect(element.style.left).toBeDefined();
      expect(element.style.transform).toBeDefined();
      expect(element.classList.add).toHaveBeenCalledWith('content-type-book');
    });

    test('should add correct CSS class for content type', () => {
      const element = {
        style: {},
        classList: {
          add: jest.fn()
        }
      };
      
      ContentAnalyzer.applyPlacementStyle(element, ContentAnalyzer.CONTENT_TYPES.MUSIC, 1);
      
      expect(element.classList.add).toHaveBeenCalledWith('content-type-music');
    });
  });

  describe('CONTENT_TYPES constants', () => {
    test('should have all required content types', () => {
      expect(ContentAnalyzer.CONTENT_TYPES).toHaveProperty('BOOK', 'book');
      expect(ContentAnalyzer.CONTENT_TYPES).toHaveProperty('MUSIC', 'music');
      expect(ContentAnalyzer.CONTENT_TYPES).toHaveProperty('ART', 'art');
      expect(ContentAnalyzer.CONTENT_TYPES).toHaveProperty('TOY', 'toy');
      expect(ContentAnalyzer.CONTENT_TYPES).toHaveProperty('DIGITAL', 'digital');
      expect(ContentAnalyzer.CONTENT_TYPES).toHaveProperty('MISC', 'misc');
    });
  });
});