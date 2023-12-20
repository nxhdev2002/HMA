import winston from 'winston'

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    // Định dạng time cho log
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    // thiết lập định dạng của log
    winston.format.printf(
      log => {
        // nếu log là error hiển thị stack trace còn không hiển thị message của log
        if (log.stack != null) return `[${log.timestamp}] [${log.level}] ${log.stack}`
        return `[${log.timestamp}] [${log.level}] ${log.message}`
      }
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

export default logger
