const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { createLogger, transports, format } = require('winston');

describe('Logger Tests', function () {
  let logger;
  const errorLogPath = 'logs/error.log';
  const combinedLogPath = 'logs/combined.log';

  beforeEach(function () {
    logger = createLogger({
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.File({ filename: errorLogPath, level: 'error' }),
        new transports.File({ filename: combinedLogPath }),
      ],
    });
  });

  afterEach(function () {
    try {
      if (fs.existsSync(errorLogPath)) {
        fs.unlinkSync(errorLogPath);
      }
      if (fs.existsSync(combinedLogPath)) {
        fs.unlinkSync(combinedLogPath);
      }
    } catch (err) {
      // Ignore cleanup errors
    }
  });

  describe('Logger Initialization', function () {
    it('should create logger with correct configuration', function () {
      expect(logger).to.exist;
      expect(logger.level).to.equal('info');
      expect(logger.transports).to.be.an('array');
      expect(logger.transports.length).to.equal(2);

      const hasErrorFileTransport = logger.transports.some(
        (transport) => transport instanceof transports.File && transport.level === 'error'
      );
      const hasCombinedFileTransport = logger.transports.some(
        (transport) => transport instanceof transports.File && !transport.level
      );

      expect(hasErrorFileTransport).to.be.true;
      expect(hasCombinedFileTransport).to.be.true;
    });

    it('should have all logging methods', function () {
      expect(logger.log).to.be.a('function');
      expect(logger.info).to.be.a('function');
      expect(logger.warn).to.be.a('function');
      expect(logger.error).to.be.a('function');
      expect(logger.debug).to.be.a('function');
    });
  });

  describe('Logging Functionality', function () {
    it('should log messages and create files', function (done) {
      logger.info('Info message');
      logger.warn('Warn message');
      logger.error('Error message');

      setTimeout(() => {
        expect(fs.existsSync(combinedLogPath)).to.be.true;
        expect(fs.existsSync(errorLogPath)).to.be.true;
        done();
      }, 400);
    });

    it('should write logs in JSON format with timestamp', function (done) {
      const message = 'Test JSON message';
      logger.info(message);

      setTimeout(() => {
        const content = fs.readFileSync(combinedLogPath, 'utf8');
        const lines = content.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const parsed = JSON.parse(lastLine);

        expect(parsed).to.have.property('message');
        expect(parsed).to.have.property('level');
        expect(parsed).to.have.property('timestamp');
        expect(parsed.message).to.include(message);
        expect(new Date(parsed.timestamp)).to.be.instanceOf(Date);
        done();
      }, 300);
    });

    it('should filter logs by level correctly', function (done) {
      const infoMessage = 'Info level message';
      const errorMessage = 'Error level message';

      logger.info(infoMessage);
      logger.error(errorMessage);

      setTimeout(() => {
        const combinedContent = fs.readFileSync(combinedLogPath, 'utf8');
        const errorContent = fs.readFileSync(errorLogPath, 'utf8');

        // Combined log should have both
        expect(combinedContent).to.include(infoMessage);
        expect(combinedContent).to.include(errorMessage);

        // Error log should only have errors
        expect(errorContent).to.not.include(infoMessage);
        expect(errorContent).to.include(errorMessage);
        done();
      }, 300);
    });

    it('should not log debug when level is info', function (done) {
      logger.debug('Debug message');
      logger.info('Info message');

      setTimeout(() => {
        const content = fs.existsSync(combinedLogPath) ? fs.readFileSync(combinedLogPath, 'utf8') : '';
        expect(content).to.not.include('Debug message');
        expect(content).to.include('Info message');
        done();
      }, 300);
    });
  });
});
