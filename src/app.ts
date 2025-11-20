import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "./routers/auth.router";
import logger from "./utils/logger";
import SiswaRouter from "./routers/siswa.router";
import GuruRouter from "./routers/guru.router";
import TingkatanRouter from "./routers/tingkatan.router";
import KelasRouter from "./routers/kelas.router";
import RuanganRouter from "./routers/ruangan.router";
import MapelRouter from "./routers/mapel.router";
import SkemaRouter from "./routers/skema.router";
import TahunAjaranRouter from "./routers/tahunAjaran.router";
import PenempatanRouter from "./routers/penempatan.router";
import PenugasanRouter from "./routers/penugasan.router";
import JadwalRouter from "./routers/jadwal.router";
import PengumumanRouter from "./routers/pengumuman.router";
import DokumenRouter from "./routers/dokumen.router";
import AbsensiRouter from "./routers/absensi.router";
import NilaiRouter from "./routers/nilai.router";
import EkskulRouter from "./routers/ekskul.router";
import CapaianRouter from "./routers/capaian.router";
import RaporRouter from "./routers/rapor.router";
import SiswaViewRouter from "./routers/siswa-view.router";
import WaliKelasRouter from "./routers/wali-kelas.router";
import GuruViewRouter from "./routers/guru-view.router";
import SekolahRouter from "./routers/sekolah.router";
import BackupRouter from "./routers/backup.router";

const PORT: string = process.env.PORT || "8181";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandler();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private route(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Classbase API</h1>");
    });

    const authRouter: AuthRouter = new AuthRouter();
    this.app.use("/auth", authRouter.getRouter());

    const siswaRouter: SiswaRouter = new SiswaRouter();
    this.app.use("/siswa", siswaRouter.getRouter());

    const guruRouter: GuruRouter = new GuruRouter();
    this.app.use("/guru", guruRouter.getRouter());

    const tingkatanRouter: TingkatanRouter = new TingkatanRouter();
    this.app.use("/tingkatan", tingkatanRouter.getRouter());

    const kelasRouter: KelasRouter = new KelasRouter();
    this.app.use("/kelas", kelasRouter.getRouter());

    const ruanganRouter: RuanganRouter = new RuanganRouter();
    this.app.use("/ruangan", ruanganRouter.getRouter());

    const mapelRouter: MapelRouter = new MapelRouter();
    this.app.use("/mapel", mapelRouter.getRouter());

    const skemaRouter: SkemaRouter = new SkemaRouter();
    this.app.use("/skema", skemaRouter.getRouter());

    const tahunAjaranRouter: TahunAjaranRouter = new TahunAjaranRouter();
    this.app.use("/tahun-ajaran", tahunAjaranRouter.getRouter());

    const penempatanRouter: PenempatanRouter = new PenempatanRouter();
    this.app.use("/penempatan", penempatanRouter.getRouter());

    const penugasanRouter: PenugasanRouter = new PenugasanRouter();
    this.app.use("/penugasan-guru", penugasanRouter.getRouter());

    const jadwalRouter: JadwalRouter = new JadwalRouter();
    this.app.use("/jadwal", jadwalRouter.getRouter());

    const pengumumanRouter: PengumumanRouter = new PengumumanRouter();
    this.app.use("/pengumuman", pengumumanRouter.getRouter());

    const dokumenRouter: DokumenRouter = new DokumenRouter();
    this.app.use("/dokumen", dokumenRouter.getRouter());

    const absensiRouter: AbsensiRouter = new AbsensiRouter();
    this.app.use("/absensi", absensiRouter.getRouter());

    const nilaiRouter: NilaiRouter = new NilaiRouter();
    this.app.use("/nilai", nilaiRouter.getRouter());

    const ekskulRouter: EkskulRouter = new EkskulRouter();
    this.app.use("/nilai-ekskul", ekskulRouter.getRouter());

    const capaianRouter: CapaianRouter = new CapaianRouter();
    this.app.use("/capaian", capaianRouter.getRouter());

    const raporRouter: RaporRouter = new RaporRouter();
    this.app.use("/rapor", raporRouter.getRouter());

    const siswaViewRouter: SiswaViewRouter = new SiswaViewRouter();
    this.app.use("/siswa-view", siswaViewRouter.getRouter());

    const waliKelasRouter: WaliKelasRouter = new WaliKelasRouter();
    this.app.use("/wali-kelas", waliKelasRouter.getRouter());

    const guruViewRouter: GuruViewRouter = new GuruViewRouter();
    this.app.use("/guru-view", guruViewRouter.getRouter());

    const sekolahRouter: SekolahRouter = new SekolahRouter();
    this.app.use("/sekolah", sekolahRouter.getRouter());

    const backupRouter: BackupRouter = new BackupRouter();
    this.app.use("/backup", backupRouter.getRouter());
  }

  private errorHandler(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        logger.error(
          `${req.method} ${req.path}: ${error.message} ${JSON.stringify(
            error
          )}`
        );
        res.status(error.code || 500).send(error);
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API Running: http://localhost:${PORT}`);
    });
  }
}

export default App;