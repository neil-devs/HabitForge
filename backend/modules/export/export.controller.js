const exportService = require('./export.service');
const fastcsv = require('fast-csv');

class ExportController {
  async exportCsv(req, res) {
    const { start_date, end_date } = req.query;
    const data = await exportService.getCsvData(req.user.id, start_date, end_date);

    res.setHeader('Content-Disposition', 'attachment; filename=habit_logs.csv');
    res.setHeader('Content-Type', 'text/csv');

    fastcsv
      .write(data, { headers: true })
      .pipe(res);
  }

  async exportPdf(req, res) {
    const { start_date, end_date } = req.query;
    res.setHeader('Content-Disposition', 'attachment; filename=habit_report.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    await exportService.generatePdf(res, req.user.id, start_date, end_date);
  }

  async exportTxt(req, res) {
    try {
      const textData = await exportService.generateTextReport(req.user.id);
      res.setHeader('Content-Disposition', 'attachment; filename=habitforge_data.txt');
      res.setHeader('Content-Type', 'text/plain');
      res.send(textData);
    } catch (error) {
      console.error('Text Export Error:', error);
      res.status(500).json({ message: 'Failed to generate text export' });
    }
  }
}

module.exports = new ExportController();
