import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import mockEspecialidades from '../../../../assets/json/especialidades.json';
import { routes } from '../../../app.routes';
import { AlertaService } from '../../../service/alerta.service';
import { EspecialidadeService } from '../../../service/especialidade.service';
import { EspecialidadeFormComponent } from './especialidade-form.component';
import { TestUtils } from '../../../utils/test-utils';

describe('EspecialidadeFormComponent', () => {
  let component: EspecialidadeFormComponent;
  let fixture: ComponentFixture<EspecialidadeFormComponent>;

  const serviceMock = {
    getById: jasmine.createSpy('getById').and.returnValue(of(mockEspecialidades[0])),
    save: jasmine.createSpy('save').and.returnValue(of(mockEspecialidades[0]))
  };

  const mockActivatedRoute = {
    snapshot: {
      queryParamMap: {
        get: jasmine.createSpy('get')
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EspecialidadeFormComponent,
        RouterModule.forRoot(routes),
        FormsModule],
      providers: [
        { provide: EspecialidadeService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecialidadeFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    mockActivatedRoute.snapshot.queryParamMap.get.calls.reset();
    serviceMock.getById.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar servico.getById quando id está presente', () => {
    mockActivatedRoute.snapshot.queryParamMap.get.and.returnValue('1');
    component.ngOnInit();
    expect(serviceMock.getById).toHaveBeenCalledWith(1);
  });

  it('não deve chamar servico.getById quando id não está presente', () => {
    mockActivatedRoute.snapshot.queryParamMap.get.and.returnValue(null);
    component.ngOnInit();
    expect(serviceMock.getById).not.toHaveBeenCalled();
  });

  it('deve chamar servico.save quando clicar no botão "Salvar"', () => {
    mockActivatedRoute.snapshot.queryParamMap.get.and.returnValue('1');
    component.ngOnInit();
    let botaoSalvar = fixture.nativeElement.querySelector('input[value="Salvar"]');
    botaoSalvar.click();
    expect(serviceMock.save).toHaveBeenCalledWith(mockEspecialidades.find(item => item.id == 1));
  });

  it('deve mudar a rota ao salvar', async () => {
    let botaoSalvar = fixture.nativeElement.querySelector('input[value="Salvar"]');
    botaoSalvar.click();
    await fixture.whenStable();
    const location: Location = TestBed.inject(Location);
    expect(location.path()).toBeTruthy();
  });

  it('deve definir a propriedade routerLink no botão "Cancelar"', () => {
    let botaoCancelar = fixture.nativeElement.querySelector('input[value="Cancelar"]');
    expect(botaoCancelar.getAttribute('routerLink')).not.toBeNull();
  });

  it('deve ter uma rota definida para o componente', () => {
    const rota = TestUtils.encontrarRotaDoComponente(routes, EspecialidadeFormComponent);
    expect(rota).toBeDefined();
  });

  it('deve ter uma rota que inicia com "config"', () => {
    const rota = TestUtils.encontrarRotaDoComponente(routes, EspecialidadeFormComponent);
    expect(rota).toContain('config');
  });

  it('deve exibir uma mensagem de confirmação ao salvar ', () => {
    const servicoAlerta = TestBed.inject(AlertaService);
    spyOn(servicoAlerta, 'enviarAlerta');
    let botaoSalvar = fixture.nativeElement.querySelector('input[value="Salvar"]');
    botaoSalvar.click();
    expect(servicoAlerta.enviarAlerta).toHaveBeenCalled();
  });
});
